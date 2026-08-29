// src/api/authApi.ts
import api from './axiosConfig';

export const loginApi = async (credentials: any) => {
  try {
    console.log('Sending login payload:', credentials);
    
    const response = await api.post('http://localhost:8081/api/auth/login', credentials);
    
    console.log('Backend Full Response:', response);
    console.log('Response Data:', response.data);

    // Save token
    const token = response.data?.token || response.data?.jwt || response.data?.accessToken;
    
    if (token) {
      localStorage.setItem('token', token);
      console.log('SUCCESS: Token saved to localStorage:', token);
    } else {
      console.error('ERROR: 200 OK received, but no token field found in response data!');
    }

    return response.data;
  } catch (error: any) {
    console.error('Login Failed with Error:', error.response || error.message);
    throw error;
  }
};

export const googleLoginApi = async (idToken: string) => {
  const response = await fetch('http://localhost:8081/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Google sign-in failed');
  }
  return data;
};