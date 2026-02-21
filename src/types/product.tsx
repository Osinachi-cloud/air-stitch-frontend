
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
  id?: string;
  rating: number ;
  comment?: string;
  author?: string;
  date?: string;
  name?: string;
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



// export interface Review {
//   name: string;
//   rating: number;
//   comment: string;
// }

export interface ProductDto {
  name: string;
  code: string;
  productImage: string;
  price: number;
  quantity: number;
  outOfStock: boolean;
  category: string;
  provider: string;
  fixedPrice: boolean;
  country: string;
  publishStatus: string;
  discount: number;
  productId: string;
  shortDescription: string;
  longDescription: string;
  materialUsed: string;
  readyIn: string;
  sellingPrice: number;
  amountByQuantity: number;
  liked: boolean;
  vendor: any;
  productVariation: Array<{
    color: string;
    sleeveType: string;
  }>;
}

export interface ProductFilterRequest {
  productId: string;
}