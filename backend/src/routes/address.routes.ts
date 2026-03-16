import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/',              requireAuth, AddressController.getAddresses);
router.post('/',             requireAuth, AddressController.createAddress);
router.put('/:id',           requireAuth, AddressController.updateAddress);
router.delete('/:id',        requireAuth, AddressController.deleteAddress);
router.put('/:id/default',   requireAuth, AddressController.setDefault);

export default router;
