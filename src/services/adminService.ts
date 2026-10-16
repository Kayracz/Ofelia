
import axios from "axios";
import type { Product } from "../data/products";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const TOKEN_KEY = "ofelia-admin-token";

const api = axios.create({
  baseURL: API_URL,
});

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export async function adminLogin(password: string): Promise<void> {
  const response = await api.post("/api/auth/login", { password });

  localStorage.setItem(TOKEN_KEY, response.data.token);
}

export function adminLogout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders() {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  const response = await api.post("/api/products", product, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function updateProductApi(
  id: number,
  product: Omit<Product, "id">
): Promise<Product> {
  const response = await api.put(`/api/products/${id}`, product, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function deleteProductApi(id: number): Promise<void> {
  await api.delete(`/api/products/${id}`, {
    headers: getAuthHeaders(),
  });
}
