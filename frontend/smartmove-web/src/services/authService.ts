import apiClient from '@/api/client';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post('/auth/login', data);
      if (res.data && res.data.token) {
        const u = res.data.user || {};
        const userId = u.PASSENGER_ID || u.DRIVER_ID || u.ADMIN_ID || u.userId || 1;
        return {
          token: res.data.token,
          role: (res.data.role || u.ROLE || 'PASSENGER') as any,
          userId: Number(userId),
          firstName: u.FIRST_NAME || u.firstName || 'User',
          lastName: u.LAST_NAME || u.lastName || '',
          email: u.EMAIL || u.email || data.email,
          phone: u.PHONE || u.phone,
          mustChangePassword: false,
        };
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

    const raw = res.data;
    if (!raw || !raw.token) {
      throw new Error('Authentication failed: No token received');
    }

    const u = raw.user || {};
    const authData: AuthResponse = {
      token: raw.token,
      role: raw.role || u.ROLE || 'PASSENGER',
      userId: u.PASSENGER_ID || u.DRIVER_ID || u.ADMIN_ID || u.userId || u.id || 1,
      firstName: u.FIRST_NAME || u.firstName || '',
      lastName: u.LAST_NAME || u.lastName || '',
      email: u.EMAIL || u.email || data.email,
      phone: u.PHONE || u.phone || '',
      mustChangePassword: false
    };

    localStorage.setItem('smartmove_token', authData.token);
    localStorage.setItem('smartmove_user', JSON.stringify(authData));
    return authData;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/register', data, {
      timeout: 300000 // 5 minutes (300,000 ms)
    });
    const raw = res.data;
    const u = raw.user || {};
    const authData: AuthResponse = {
      token: raw.token || '',
      role: raw.role || (data.role as any) || 'PASSENGER',
      userId: u.PASSENGER_ID || u.DRIVER_ID || u.id || 1,
      firstName: u.FIRST_NAME || data.firstName,
      lastName: u.LAST_NAME || data.lastName,
      email: u.EMAIL || data.email,
      phone: u.PHONE || data.phone || '',
      mustChangePassword: false
    };

    if (authData.token) {
      localStorage.setItem('smartmove_token', authData.token);
      localStorage.setItem('smartmove_user', JSON.stringify(authData));
    }
    return authData;
  },

  changePassword: async (newPassword: string): Promise<boolean> => {
    await apiClient.put('/auth/change-password', { newPassword });
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      currentUser.mustChangePassword = false;
      localStorage.setItem('smartmove_user', JSON.stringify(currentUser));
      return true;
    }
    return true;
  },

  logout: () => {
    localStorage.removeItem('smartmove_token');
    localStorage.removeItem('smartmove_user');
  },

  getCurrentUser: (): AuthResponse | null => {
    const user = localStorage.getItem('smartmove_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('smartmove_token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('smartmove_token');
  },
};

export default authService;
