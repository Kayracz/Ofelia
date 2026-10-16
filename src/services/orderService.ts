
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface CreateOrderData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  reference: string;
  delivery: "envio" | "retiro";
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface CreatedOrder {
  orderNumber: string;
  totalPrice: number;
  status: string;
}

export async function createOrder(
  orderData: CreateOrderData
): Promise<CreatedOrder> {
  const response = await axios.post(
    `${API_URL}/api/orders`,
    orderData
  );

  return response.data.order;
}
