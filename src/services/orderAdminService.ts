
import { adminApi, getAdminToken } from "./adminService";

const ORDERS_URL = "/api/orders";

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
    variantLabel?: string;
  }[];
  totalPrice: number;
  status: "pendiente" | "pagado" | "enviado" | "cancelado";
  createdAt: string;
}

function getHeaders() {
  const token = getAdminToken();

  if (!token) {
    throw new Error(
      "Tu sesión de administrador no está activa. Inicia sesión nuevamente."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const response = await adminApi.get<AdminOrder[]>(ORDERS_URL, {
    headers: getHeaders(),
  });

  return response.data;
}

export async function updateAdminOrderStatus(
  id: string,
  status: AdminOrder["status"]
): Promise<void> {
  await adminApi.patch(
    `${ORDERS_URL}/${id}/status`,
    { status },
    { headers: getHeaders() }
  );
}
