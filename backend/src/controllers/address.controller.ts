import { Response, NextFunction } from 'express';
import { AddressService } from '../services/address.service';
import { AuthenticatedRequest } from '../types/auth.types';

export class AddressController {
  static async getAddresses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const addresses = await AddressService.getAddresses(userId);
      res.json({ addresses });
    } catch (err) {
      next(err);
    }
  }

  static async createAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const address = await AddressService.createAddress(userId, req.body);
      res.status(201).json({ address });
    } catch (err) {
      next(err);
    }
  }

  static async updateAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const address = await AddressService.updateAddress(userId, id, req.body);
      res.json({ address });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      await AddressService.deleteAddress(userId, id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async setDefault(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const id = req.params.id as string;
      const address = await AddressService.setDefault(userId, id);
      res.json({ address });
    } catch (err) {
      next(err);
    }
  }
}
