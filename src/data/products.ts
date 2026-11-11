
export interface ProductVariant {
  label: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  category: "panolletas" | "flecos" | "twillys";
  price: number;
  variants?: ProductVariant[];
  isNew: boolean;
  description: string;
  imageUrl?: string;
  images?: string[];
}
