export type CategoryTypeName = 'service' | 'product' | 'promotion';

export interface CategoryType {
  id: number;
  name: CategoryTypeName;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}