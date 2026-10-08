import apiClient from '@/api/client';
import { Passenger, PassengerFormData } from '@/types';

const passengerService = {
  getAll: async (): Promise<Passenger[]> => {
    const res = await apiClient.get('/passengers');
    return res.data;
  },
  getById: async (id: number): Promise<Passenger> => {
    const res = await apiClient.get(`/passengers/${id}`);
    return res.data;
  },
  update: async (id: number, data: PassengerFormData): Promise<Passenger> => {
    const res = await apiClient.put(`/passengers/${id}`, data);
    return res.data;
  },
  getProfile: async (): Promise<Passenger> => {
    const res = await apiClient.get('/passengers/profile');
    return res.data;
  },
  updateProfile: async (data: Partial<PassengerFormData>): Promise<Passenger> => {
    const res = await apiClient.put('/passengers/profile', data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/passengers/${id}`);
  },
  search: async (query: string): Promise<Passenger[]> => {
    const res = await apiClient.get(`/passengers/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default passengerService;
