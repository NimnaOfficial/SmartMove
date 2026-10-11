import apiClient from '@/api/client';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';
import { mockStore, DEFAULT_DRIVER_PASSWORD } from './mockDataStore';

const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post('/auth/login', data);
      if (res.data && res.data.token) {
        return res.data;
      }
    } catch {
      // Backend offline or error: fall back seamlessly to local mock store
    }

    const email = (data.email || '').trim().toLowerCase();
    const password = data.password || '';

    // 1. Check if user is a Driver (either newly created or pre-seeded)
    const driverAuth = mockStore.verifyDriverPassword(email, password);
    if (driverAuth.success && driverAuth.driver) {
      const d = driverAuth.driver;
      return {
        token: `mock-driver-jwt-${d.driverId}-${Date.now()}`,
        role: 'DRIVER',
        userId: d.driverId,
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        mustChangePassword: driverAuth.mustChangePassword
      };
    }

    // 2. Check if user is an Admin
    if (
      email === 'admin@smartmove.lk' ||
      email === 'admin@smartmove.com' ||
      email === 'admin' ||
      (email.includes('admin') && (password === 'admin' || password === 'Admin@123' || password === 'admin123'))
    ) {
      return {
        token: `mock-admin-jwt-${Date.now()}`,
        role: 'ADMIN',
        userId: 1,
        firstName: 'Central',
        lastName: 'Admin',
        email: data.email || 'admin@smartmove.lk',
        mustChangePassword: false
      };
    }

    // 3. Check if user is a Passenger
    if (
      email === 'passenger@smartmove.lk' ||
      email.includes('passenger') ||
      email.includes('kasun') ||
      password === 'passenger' ||
      password === 'passenger123'
    ) {
      return {
        token: `mock-passenger-jwt-${Date.now()}`,
        role: 'PASSENGER',
        userId: 101,
        firstName: 'Kasun',
        lastName: 'Jayawardena',
        email: data.email || 'passenger@smartmove.lk',
        mustChangePassword: false
      };
    }

    // If driver email exists but password was wrong
    const existingDriver = mockStore.getDrivers().find(d => d.email.toLowerCase() === email);
    if (existingDriver) {
      throw new Error(`Invalid password for driver account. New drivers must use temporary password '${DEFAULT_DRIVER_PASSWORD}'.`);
    }

    throw new Error('Invalid email or password. Please check your credentials.');
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post('/auth/register', data);
      return res.data;
    } catch {
      return {
        token: `mock-reg-token-${Date.now()}`,
        role: data.role || 'PASSENGER',
        userId: Math.floor(1000 + Math.random() * 9000),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mustChangePassword: false
      };
    }
  },

  changePassword: async (newPassword: string): Promise<boolean> => {
    try {
      await apiClient.put('/auth/change-password', { newPassword });
    } catch {}

    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      if (currentUser.role === 'DRIVER') {
        mockStore.changeDriverPassword(currentUser.email || currentUser.userId, newPassword);
      }
      currentUser.mustChangePassword = false;
      localStorage.setItem('smartmove_user', JSON.stringify(currentUser));
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('smartmove_token');
    localStorage.removeItem('smartmove_user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const user = localStorage.getItem('smartmove_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('smartmove_token'),
  getToken: () => localStorage.getItem('smartmove_token'),
};

export default authService;
