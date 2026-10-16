
import axios from "axios";
import type { Product } from "../data/products";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface ApiProduct extends Product {
  _id: string;
  slug: string;
  active: boolean;
}

export async function getProducts(): Promise<ApiProduct[]> {
  const response = await axios.get<ApiProduct[]>(
    `${API_URL}/api/products`
  );

  return response.data;
}

export async function getProductBySlug(
  slug: string
): Promise<ApiProduct> {
  const response = await axios.get<ApiProduct>(
    `${API_URL}/api/products/${slug}`
  );

  return response.data;
}
