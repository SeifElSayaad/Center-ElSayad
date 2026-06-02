import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { AuthenticatedRequest } from '../types/auth.types';

export class ReviewController {
  static async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const page = parseInt(req.query.page?.toString() || '1') || 1;
      const limit = parseInt(req.query.limit?.toString() || '10') || 10;

      const result = await ReviewService.getProductReviews(productId as string, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async submitReview(expressReq: Request, res: Response, next: NextFunction) {
    try {
      const req = expressReq as AuthenticatedRequest;
      const { productId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user!.userId;

      const review = await ReviewService.upsertReview(userId, productId as string, rating, comment);
      res.status(200).json(review);
    } catch (error: any) {
      if (error.message === 'Product not found') {
        res.status(404).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  static async deleteReview(expressReq: Request, res: Response, next: NextFunction) {
    try {
      const req = expressReq as AuthenticatedRequest;
      const { productId } = req.params;
      const userId = req.user!.userId;

      await ReviewService.deleteReview(userId, productId as string);
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error: any) {
      if (error.code === 'P2025') { // Prisma RecordNotFound
        res.status(404).json({ error: 'Review not found' });
      } else {
        next(error);
      }
    }
  }
}
