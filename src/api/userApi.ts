import api from './axiosConfig';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

const AUTH_BASE_URL = 'http://localhost:8081/api/auth';

export const getAllUsersApi = async (): Promise<AdminUser[]> => {
  const response = await api.get(`${AUTH_BASE_URL}/admin/users`);
  return response.data;
};

export const updateUserRoleApi = async (
  id: number,
  role: 'USER' | 'ADMIN'
): Promise<AdminUser> => {
  const response = await api.put(`${AUTH_BASE_URL}/admin/users/${id}/role?role=${role}`);
  return response.data;
};

export const deleteUserApi = async (id: number): Promise<void> => {
  await api.delete(`${AUTH_BASE_URL}/admin/users/${id}`);
};