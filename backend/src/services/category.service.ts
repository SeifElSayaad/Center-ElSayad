import prisma from '../lib/prisma';
import { Category } from '@prisma/client';

interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

type UpdateCategoryData = Partial<CreateCategoryData>;

export class CategoryService {
  static async getAllCategories(includeInactive = false): Promise<Category[]> {
    return prisma.category.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  static async createCategory(data: CreateCategoryData): Promise<Category> {
    return prisma.category.create({ data });
  }

  static async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  static async deleteCategory(id: string): Promise<void> {
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new Error(`Cannot delete category: it has ${productCount} product(s) assigned to it. Reassign or delete them first.`);
    }
    await prisma.category.delete({ where: { id } });
  }

  static async getCategoryStats() {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return categories;
  }
}
