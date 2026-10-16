
import axios from "axios";
import { getAdminToken } from "./adminService";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
  };
  delivery: {
    method: "envio" | "retiro";
    department: string;
    city: string;
    address: string;
    reference: string;
  };
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  totalPrice: number;
  status: "pendiente" | "pagado" | "enviado" | "cancelado";
  createdAt: string;
}

const api = axios.create({
  baseURL: `${API_URL}/api/orders`,
});

function getHeaders() {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Inicia sesión como administrador para ver los pedidos.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const response = await api.get<AdminOrder[]>("/", {
    headers: getHeaders(),
  });

  return response.data;
}

export async function updateAdminOrderStatus(
  id: string,
  status: AdminOrder["status"]
): Promise<void> {
  await api.patch(
    `/${id}/status`,
    { status },
    { headers: getHeaders() }
  );
}
