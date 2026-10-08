import apiClient from '@/api/client';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('smartmove_token');
    localStorage.removeItem('smartmove_user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('smartmove_user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('smartmove_token'),
  getToken: () => localStorage.getItem('smartmove_token'),
};
export default authService;
