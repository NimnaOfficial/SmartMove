import apiClient from '@/api/client';
import { Driver, DriverFormData } from '@/types';
import authService from './authService';
import tripService from './tripService';

const driverService = {
  getAll: async (): Promise<Driver[]> => {
    const res = await apiClient.get('/drivers');
    return Array.isArray(res.data) ? res.data : [];
  },
  getById: async (id: number): Promise<Driver> => {
    const res = await apiClient.get(`/drivers/${id}`);
    return res.data;
  },
  create: async (data: DriverFormData): Promise<Driver> => {
    const res = await apiClient.post('/drivers', data);
    return res.data;
  },
  update: async (id: number, data: DriverFormData): Promise<Driver> => {
    const res = await apiClient.put(`/drivers/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/drivers/${id}`);
  },
  getProfile: async (): Promise<Driver> => {
    const res = await apiClient.get('/drivers/profile');
    if (res.data && res.data.driverId) return res.data;

    // Fallback to fetch by current authenticated user ID
    const user = authService.getCurrentUser();
    if (user && user.userId) {
      const driverRes = await apiClient.get(`/drivers/${user.userId}`);
      return driverRes.data;
    }
    return res.data;
  },
  updateProfile: async (data: Partial<DriverFormData>): Promise<Driver> => {
    const res = await apiClient.put('/drivers/profile', data);
    return res.data;
  },
  getMyTrips: async (): Promise<any[]> => {
    const res = await apiClient.get('/drivers/my-trips');
    return Array.isArray(res.data) ? res.data : [];
  },
  updateTripStatus: async (tripId: number, status: string): Promise<any> => {
    return tripService.updateStatus(tripId, status);
  },
  search: async (query: string): Promise<Driver[]> => {
    const res = await apiClient.get(`/drivers/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  changePassword: async (newPassword: string): Promise<boolean> => {
    return authService.changePassword(newPassword);
  },
};

export default driverService;
