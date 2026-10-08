import apiClient from '@/api/client';
import { Driver, DriverFormData } from '@/types';

const driverService = {
  getAll: async (): Promise<Driver[]> => {
    const res = await apiClient.get('/drivers');
    return res.data;
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
  getProfile: async (): Promise<Driver> => {
    const res = await apiClient.get('/drivers/profile');
    return res.data;
  },
  updateProfile: async (data: Partial<DriverFormData>): Promise<Driver> => {
    const res = await apiClient.put('/drivers/profile', data);
    return res.data;
  },
  getMyTrips: async (): Promise<any[]> => {
    const res = await apiClient.get('/drivers/my-trips');
    return res.data;
  },
  search: async (query: string): Promise<Driver[]> => {
    const res = await apiClient.get(`/drivers/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default driverService;
