export interface CreateCategoryBody {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryBody extends Partial<CreateCategoryBody> {}
