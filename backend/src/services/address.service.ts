import prisma from '../lib/prisma';

export interface CreateAddressData {
  label?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state?: string;
  country?: string;
  isDefault?: boolean;
}

export class AddressService {
  static async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async createAddress(userId: string, data: CreateAddressData) {
    // If new address is marked as default, unset all others first
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        userId,
        label: data.label,
        fullName: data.fullName,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country ?? 'Egypt',
        isDefault: data.isDefault ?? false,
      },
    });
  }

  static async updateAddress(userId: string, addressId: string, data: Partial<CreateAddressData>) {
    // Ensure the address belongs to this user
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new Error('Address not found');
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  static async deleteAddress(userId: string, addressId: string) {
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new Error('Address not found');
    }

    await prisma.address.delete({ where: { id: addressId } });
  }

  static async setDefault(userId: string, addressId: string) {
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw new Error('Address not found');
    }

    // Unset all, then set this one
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
