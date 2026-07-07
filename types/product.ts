export type JerseyCategory = "home" | "away" | "third" | "retro" | "goalkeeper";

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  country: string;
  countryCode: string; // ISO code, used for flag emoji / assets
  brand: string;
  price: number;
  compareAtPrice?: number;
  sizes: string[];
  description: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: ProductReview[];
  isFeatured: boolean;
  category: JerseyCategory;
  isTrending?: boolean;
  stillInCompetition?: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}
