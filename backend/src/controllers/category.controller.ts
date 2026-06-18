import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { uploadImageBuffer } from '../utils/cloudinary';

export class CategoryController {
  static async getCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const withStats = req.query.withStats === 'true';
      if (withStats) {
        const categories = await CategoryService.getCategoryStats();
        res.json(categories);
      } else {
        const categories = await CategoryService.getAllCategories(includeInactive);
        res.json(categories);
      }
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = String(req.params.id);
      const category = await CategoryService.getCategoryById(id);
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body as Record<string, unknown>;
      if (req.file) {
        data.imageUrl = await uploadImageBuffer(req.file.buffer, 'categories');
      }
      const category = await CategoryService.createCategory({
        name: data.name as string,
        slug: data.slug as string,
        description: data.description as string | undefined,
        imageUrl: data.imageUrl as string | undefined,
        sortOrder: data.sortOrder ? Number(data.sortOrder) : undefined,
        isActive: data.isActive === 'true' || data.isActive === true,
      });
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body as Record<string, unknown>;
      if (req.file) {
        data.imageUrl = await uploadImageBuffer(req.file.buffer, 'categories');
      }
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
      if (data.sortOrder !== undefined) updateData.sortOrder = Number(data.sortOrder);
      if (data.isActive !== undefined) updateData.isActive = data.isActive === 'true' || data.isActive === true;

      const category = await CategoryService.updateCategory(String(req.params.id), updateData);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await CategoryService.deleteCategory(String(req.params.id));
      res.status(204).send();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error deleting category';
      if (message.startsWith('Cannot delete category')) {
        res.status(409).json({ error: message });
        return;
      }
      next(error);
    }
  }
}