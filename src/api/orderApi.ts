// src/api/orderApi.ts
import api from './axiosConfig';

export interface OrderItem {
  id: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userEmail: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}

const ORDER_BASE_URL = `${import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8084'}/api/orders`;

// Checkout (used by CartPage)
export const createOrderApi = async (items: {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}[]): Promise<Order> => {
  const response = await api.post(`${ORDER_BASE_URL}`, { items });
  return response.data;
};

// Admin Endpoints
export const getAllOrdersApi = async (): Promise<Order[]> => {
  const response = await api.get(`${ORDER_BASE_URL}/admin/all`);
  return response.data;
};

export const updateOrderStatusApi = async (
  id: number,
  status: Order['status']
): Promise<Order> => {
  const response = await api.put(`${ORDER_BASE_URL}/admin/${id}/status?status=${status}`);
  return response.data;
};

export const deleteOrderApi = async (id: number): Promise<void> => {
  await api.delete(`${ORDER_BASE_URL}/admin/${id}`);
};

export const deleteAllOrdersApi = async (): Promise<void> => {
  await api.delete(`${ORDER_BASE_URL}/admin/all`);
};

// User Endpoints
export const getMyOrdersApi = async (): Promise<Order[]> => {
  const response = await api.get(`${ORDER_BASE_URL}/my-orders`);
  return response.data;
};

export const getOrderByIdApi = async (id: number): Promise<Order> => {
  const response = await api.get(`${ORDER_BASE_URL}/${id}`);
  return response.data;
};