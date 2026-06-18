import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { OrderStatus } from '@prisma/client';

export class AdminController {
  
  /**
   * Bulk sync products from CSV.
   */
  static async bulkSyncProducts(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'CSV file is required' });
        return;
      }

      // Check if it's a valid CSV
      if (req.file.mimetype !== 'text/csv' && req.file.mimetype !== 'application/vnd.ms-excel') {
        res.status(400).json({ error: 'File must be a CSV' });
        return;
      }

      const result = await AdminService.bulkSyncProducts(req.file.buffer);
      res.status(200).json({ message: 'Bulk sync completed', result });
    } catch (error: unknown) {
      console.error('Bulk sync err:', error);
      const message = error instanceof Error ? error.message : 'Unknown error during bulk sync';
      res.status(500).json({ error: message });
    }
  }

  /**
   * Get all orders with pagination and filtering.
   */
  static async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { status, page, limit } = req.query;

      const filters = {
        status: status ? (status as OrderStatus) : undefined,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      };

      const result = await AdminService.getAllOrders(filters);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error fetching orders';
      res.status(500).json({ error: message });
    }
  }

  /**
   * Get dashboard statistics.
   */
  static async getDashboardStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json(stats);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error fetching stats';
      res.status(500).json({ error: message });
    }
  }

  /**
   * List all B2C customers with basic order stats.
   */
  static async getCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { search, page, limit } = req.query;

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 20;
      const skip = (pageNum - 1) * limitNum;

      const searchStr = Array.isArray(search) ? search[0] : (search as string | undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = { userType: 'B2C' };
      if (searchStr) {
        where.OR = [
          { firstName: { contains: searchStr, mode: 'insensitive' } },
          { lastName: { contains: searchStr, mode: 'insensitive' } },
          { email: { contains: searchStr, mode: 'insensitive' } },
        ];
      }

      const { AdminService: AS } = await import('../services/admin.service');
      const result = await AS.getCustomers(where, skip, limitNum);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error fetching customers';
      res.status(500).json({ error: message });
    }
  }

  /**
   * Toggle a customer's isActive status (suspend / reactivate).
   */
  static async toggleCustomerStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { AdminService: AS } = await import('../services/admin.service');
      const updated = await AS.toggleCustomerStatus(id);
      res.json(updated);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error updating customer status';
      res.status(500).json({ error: message });
    }
  }
}
