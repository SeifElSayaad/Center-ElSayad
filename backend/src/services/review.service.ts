import prisma from '../lib/prisma';

export class ReviewService {
  /**
   * Fetch paginated reviews for a product and include user basic info
   */
  static async getProductReviews(productId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, totalCount, aggregations] = await prisma.$transaction([
      prisma.review.findMany({
        where: { productId, isVisible: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
      }),
      prisma.review.count({
        where: { productId, isVisible: true },
      }),
      prisma.review.aggregate({
        where: { productId, isVisible: true },
        _avg: { rating: true },
      }),
    ]);

    return {
      data: reviews,
      metadata: {
        totalItems: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        averageRating: aggregations._avg.rating || 0,
      },
    };
  }

  /**
   * Upsert a user's review for a product (create or update if exists)
   */
  static async upsertReview(userId: string, productId: string, rating: number, comment?: string) {
    // Check if product exists first
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        rating,
        comment,
        updatedAt: new Date(),
      },
      create: {
        userId,
        productId,
        rating,
        comment,
      },
    });

    return review;
  }

  /**
   * Delete a review (soft delete by setting isVisible to false, or hard delete)
   * Going with hard delete for user's own management
   */
  static async deleteReview(userId: string, productId: string) {
    await prisma.review.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return true;
  }
}
