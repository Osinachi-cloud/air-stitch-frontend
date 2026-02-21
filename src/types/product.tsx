
export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  currency: string;
  inStock: boolean;
  deliveryTime: string;
  images: string[];
  features: string[];
  colors: ColorOption[];
  sizes: SizeOption[];
  sleeveLengths: SleeveOption[];
  reviews: Review[];
  relatedProducts: RelatedProduct[];
  mobileSpecific: {
    title: string;
    subtitle: string;
    colorDescription: string;
    tags: string[];
  };
}

export interface ColorOption {
  id: string;
  name: string;
  value: string;
  displayName: string;
}

export interface SizeOption {
  id: string;
  name: string;
  inStock: boolean;
}

export interface SleeveOption {
  id: string;
  name: string;
  displayName: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface ProductVariation {
  color: string;
  sleeveType: string;
}