import prisma from '../lib/prisma';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import { OrderStatus } from '@prisma/client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CsvProductRow {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  name: string;
  slug: string;
  description?: string;
  retailPrice?: string;
  stockQuantity?: string;
  categoryId?: string;
  imageUrl?: string;
}

interface BulkSyncResult {
  created: number;
  updated: number;
  deleted: number;
  errors: string[];
}

interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class AdminService {

  /**
   * Parse a CSV buffer and execute bulk create/update/delete in a transaction.
   */
  static async bulkSyncProducts(buffer: Buffer): Promise<BulkSyncResult> {
    const rows = await AdminService.parseCsv(buffer);
    const result: BulkSyncResult = { created: 0, updated: 0, deleted: 0, errors: [] };

    await prisma.$transaction(async (tx) => {
      for (const row of rows) {
        try {
          const action = row.action?.toUpperCase()?.trim();

          if (action === 'CREATE') {
            if (!row.name || !row.slug || !row.retailPrice || !row.categoryId) {
              result.errors.push(`CREATE: Missing required fields for "${row.name || row.slug || 'unknown'}"`);
              continue;
            }
            await tx.product.create({
              data: {
                name: row.name.trim(),
                slug: row.slug.trim(),
                description: row.description?.trim() || null,
                retailPrice: parseFloat(row.retailPrice),
                stockQuantity: parseInt(row.stockQuantity || '0', 10),
                categoryId: row.categoryId.trim(),
                images: row.imageUrl ? { create: [{ url: row.imageUrl.trim() }] } : undefined,
              },
            });
            result.created++;
          } else if (action === 'UPDATE') {
            if (!row.slug) {
              result.errors.push(`UPDATE: Missing slug identifier`);
              continue;
            }
            const existing = await tx.product.findUnique({ where: { slug: row.slug.trim() } });
            if (!existing) {
              result.errors.push(`UPDATE: Product with slug "${row.slug}" not found`);
              continue;
            }

            // Only update non-empty fields
            const updateData: Record<string, unknown> = {};
            if (row.name?.trim()) updateData.name = row.name.trim();
            if (row.description?.trim()) updateData.description = row.description.trim();
            if (row.retailPrice?.trim()) updateData.retailPrice = parseFloat(row.retailPrice);
            if (row.stockQuantity?.trim()) updateData.stockQuantity = parseInt(row.stockQuantity, 10);
            if (row.categoryId?.trim()) updateData.categoryId = row.categoryId.trim();

            await tx.product.update({ where: { slug: row.slug.trim() }, data: updateData });
            result.updated++;
          } else if (action === 'DELETE') {
            if (!row.slug) {
              result.errors.push(`DELETE: Missing slug identifier`);
              continue;
            }
            const existing = await tx.product.findUnique({ where: { slug: row.slug.trim() } });
            if (!existing) {
              result.errors.push(`DELETE: Product with slug "${row.slug}" not found`);
              continue;
            }
            await tx.product.delete({ where: { slug: row.slug.trim() } });
            result.deleted++;
          } else {
            result.errors.push(`Unknown action "${row.action}" for row "${row.name || row.slug}"`);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          result.errors.push(`Error processing "${row.name || row.slug}": ${message}`);
        }
      }
    });

    return result;
  }

  /**
   * Parse CSV buffer into an array of row objects.
   */
  private static parseCsv(buffer: Buffer): Promise<CsvProductRow[]> {
    return new Promise((resolve, reject) => {
      const rows: CsvProductRow[] = [];
      const stream = Readable.from(buffer.toString());

      stream
        .pipe(csvParser())
        .on('data', (row: CsvProductRow) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', (err: Error) => reject(err));
    });
  }

  /**
   * Fetch all orders with optional status filter and pagination.
   */
  static async getAllOrders(filters: OrderFilters) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Dashboard statistics.
   */
  static async getDashboardStats() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      lowStockProducts,
      revenueResult,
      newUsersThisWeek,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { userType: 'B2C' } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { stockQuantity: { lt: 10 }, isActive: true } }),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo }, userType: 'B2C' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      pendingOrders,
      lowStockProducts,
      totalRevenue: revenueResult._sum.totalAmount || 0,
      newUsersThisWeek,
      recentOrders,
    };
  }

  /**
   * Fetch B2C customers with optional search filter and pagination.
   */
  static async getCustomers(
    where: Record<string, unknown>,
    skip: number,
    limit: number
  ) {
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          isActive: true,
          userType: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      customers,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Toggle isActive on a user (suspend / reactivate).
   */
  static async toggleCustomerStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true, userType: true },
    });

    if (!user) throw new Error('User not found');
    if (user.userType === 'ADMIN') throw new Error('Cannot change status of an admin user');

    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
    });
  }
}
