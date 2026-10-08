import apiClient from '@/api/client';
import { Vehicle, VehicleFormData } from '@/types';

const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const res = await apiClient.get('/vehicles');
    return res.data;
  },
  getById: async (id: number): Promise<Vehicle> => {
    const res = await apiClient.get(`/vehicles/${id}`);
    return res.data;
  },
  create: async (data: VehicleFormData): Promise<Vehicle> => {
    const res = await apiClient.post('/vehicles', data);
    return res.data;
  },
  update: async (id: number, data: VehicleFormData): Promise<Vehicle> => {
    const res = await apiClient.put(`/vehicles/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },
  search: async (query: string): Promise<Vehicle[]> => {
    const res = await apiClient.get(`/vehicles/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default vehicleService;
