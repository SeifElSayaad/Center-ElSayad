export interface CreateProductBody {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  retailPrice: number;
  stockQuantity?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  imageUrl?: string;
}

export interface UpdateProductBody extends Partial<CreateProductBody> {}

export interface ProductQueryFilters {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  isFeatured?: string;
  isActive?: string;
  page?: string | number;
  limit?: string | number;
}
