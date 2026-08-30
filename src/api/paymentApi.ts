import api from './axiosConfig';

const PAYMENT_BASE_URL = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8085';

export const processPaymentApi = async (orderId: number, amount: number) => {
  const response = await api.post(`${PAYMENT_BASE_URL}/api/payments/process`, { orderId, amount });
  return response.data;
};

export const getMyPaymentsApi = async () => {
  const response = await api.get(`${PAYMENT_BASE_URL}/api/payments/my-payments`);
  return response.data;
};