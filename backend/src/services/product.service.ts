import prisma from '../lib/prisma';
import { CreateProductBody, UpdateProductBody, ProductQueryFilters } from '../types/product.types';

export class ProductService {
  static async getAllProducts(filters: ProductQueryFilters) {
    const { categoryId, minPrice, maxPrice, search, isFeatured, isActive } = filters;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    
    if (categoryId) where.categoryId = categoryId;
    if (minPrice) where.retailPrice = { ...where.retailPrice, gte: parseFloat(minPrice) };
    if (maxPrice) where.retailPrice = { ...where.retailPrice, lte: parseFloat(maxPrice) };
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true; // default to active only for regular queries
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
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
    return prisma.product.create({
      data,
    });
  }

  static async updateProduct(id: string, data: UpdateProductBody) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
