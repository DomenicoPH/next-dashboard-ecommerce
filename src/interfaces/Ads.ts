export interface Ad {
  id: string;
  category: {
    id: string;
    name: string;
    isActive: boolean;
  };
  isActive: boolean;
  imgUrl: string;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}