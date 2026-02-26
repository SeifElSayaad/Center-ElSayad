import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { CreateProductBody, UpdateProductBody, ProductQueryFilters } from '../types/product.types';

export class ProductController {
  static async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters = req.query as unknown as ProductQueryFilters;
      const products = await ProductService.getAllProducts(filters);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const product = await ProductService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const body = req.body as CreateProductBody;
      const newProduct = await ProductService.createProduct(body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const body = req.body as UpdateProductBody;
      const updatedProduct = await ProductService.updateProduct(id, body);
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      await ProductService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
