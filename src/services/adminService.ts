
import axios from "axios";
import type { Product } from "../data/products";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const TOKEN_KEY = "ofelia-admin-token";

export const adminApi = axios.create({
  baseURL: API_URL,
});

// Obtener token
export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Iniciar sesión
export async function adminLogin(password: string): Promise<void> {
  const response = await adminApi.post("/api/auth/login", { password });

  localStorage.setItem(TOKEN_KEY, response.data.token);
}

// Cerrar sesión
export function adminLogout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Interceptor para adjuntar el token automáticamente
adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para detectar sesiones caducadas
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isLoginRequest = requestUrl.includes("/api/auth/login");

    if (status === 401 && !isLoginRequest) {
      adminLogout();

      if (window.location.pathname !== "/admin/login") {
        window.location.replace("/admin/login?session=expired");
      }
    }

    return Promise.reject(error);
  }
);

// Encabezados para operaciones protegidas
function getAuthHeaders() {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Debes iniciar sesión como administrador.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// Crear producto
export async function createProduct(
  product: Omit<Product, "id">
): Promise<Product> {
  const response = await adminApi.post("/api/products", product, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

// Actualizar producto
export async function updateProductApi(
  id: number,
  product: Omit<Product, "id">
): Promise<Product> {
  const response = await adminApi.put(`/api/products/${id}`, product, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

// Eliminar producto
export async function deleteProductApi(id: number): Promise<void> {
  await adminApi.delete(`/api/products/${id}`, {
    headers: getAuthHeaders(),
  });
}
