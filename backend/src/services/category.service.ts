import prisma from '../lib/prisma';
import { Category } from '@prisma/client';

export class CategoryService {
  static async getAllCategories(includeInactive = false): Promise<Category[]> {
    return prisma.category.findMany({
      where: includeInactive ? undefined : { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
