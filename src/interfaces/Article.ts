export interface Article {
    id: string;
    images: { id: string; name: string; imgUrl: string }[];
    mainImage?: { id: string; name: string; imgUrl: string };
    name: string;
    description: string;
    price: number;
    onDiscount: boolean;
    discountPrice: number;
    isActive: boolean;
    category: {
      id: string;
      name: string;
      type: {
        id: number;
        name: string;
      };
    };
    stock?: number;
    size?: string;
    brand?: string;
    sessions?: number;
  }