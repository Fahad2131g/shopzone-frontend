import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  email: localStorage.getItem('email'),
  role: localStorage.getItem('role'),
  isAuthenticated: !!localStorage.getItem('token'),
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; email?: string; role?: string }>
    ) => {
      const email = action.payload.email || '';
      const role = action.payload.role || 'USER';

      state.token = action.payload.token;
      state.email = email;
      state.role = role;
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;