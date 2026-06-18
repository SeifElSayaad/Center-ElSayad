import prisma from '../lib/prisma';
import { CreateProductBody, UpdateProductBody, ProductQueryFilters } from '../types/product.types';

export class ProductService {
  static async getAllProducts(filters: ProductQueryFilters) {
    // The frontend sends `category` (the category id), the backend type uses `categoryId`.
    // Support both to avoid a mismatch.
    const { category, categoryId, minPrice, maxPrice, search, isFeatured, isActive, page, limit } = filters as any;
    const resolvedCategoryId = categoryId || category;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    
    if (resolvedCategoryId) where.categoryId = resolvedCategoryId;
    if (minPrice) where.retailPrice = { ...where.retailPrice, gte: parseFloat(minPrice) };
    if (maxPrice) where.retailPrice = { ...where.retailPrice, lte: parseFloat(maxPrice) };
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    
    if (isActive === 'all') {
      // Admin panel: show all products regardless of active status
    } else if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true; // default to active only for customer-facing queries
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [data, totalItems] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data,
      metadata: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum,
      },
    };
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      }
    });
  }

  static async createProduct(data: CreateProductBody) {
    const { imageUrl, ...productData } = data;
    
    return prisma.product.create({
      data: {
        ...productData,
        ...(imageUrl ? {
          images: {
            create: [{ url: imageUrl, sortOrder: 0 }]
          }
        } : {})
      },
      include: {
        images: true,
      }
    });
  }

  static async updateProduct(id: string, data: UpdateProductBody) {
    const { imageUrl, ...productData } = data;
    
    // If an imageUrl is provided, we replace the first image (or add it if none exist)
    if (imageUrl) {
      // Delete existing images first for simplicity (assuming 1 image per product for now)
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }

    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(imageUrl ? {
          images: {
            create: [{ url: imageUrl, sortOrder: 0 }]
          }
        } : {})
      },
      include: {
        images: true,
      }
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
