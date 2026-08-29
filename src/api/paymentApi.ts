import api from './axiosConfig';

export const processPaymentApi = async (orderId: number, amount: number) => {
  const response = await api.post('http://localhost:8085/api/payments/process', { orderId, amount });
  return response.data;
};

export const getMyPaymentsApi = async () => {
  const response = await api.get('http://localhost:8085/api/payments/my-payments');
  return response.data;
};