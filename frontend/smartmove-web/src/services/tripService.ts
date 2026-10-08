import apiClient from '@/api/client';
import { Trip, TripFormData } from '@/types';

const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const res = await apiClient.get('/trips');
    return res.data;
  },
  getById: async (id: number): Promise<Trip> => {
    const res = await apiClient.get(`/trips/${id}`);
    return res.data;
  },
  create: async (data: TripFormData): Promise<Trip> => {
    const res = await apiClient.post('/trips', data);
    return res.data;
  },
  update: async (id: number, data: Partial<TripFormData>): Promise<Trip> => {
    const res = await apiClient.put(`/trips/${id}`, data);
    return res.data;
  },
  updateStatus: async (id: number, status: string): Promise<Trip> => {
    const res = await apiClient.patch(`/trips/${id}/status`, { status });
    return res.data;
  },
  search: async (params: { origin?: string; destination?: string; date?: string; maxPrice?: number }): Promise<Trip[]> => {
    const res = await apiClient.get('/trips/search', { params });
    return res.data;
  },
  getUpcoming: async (): Promise<Trip[]> => {
    const res = await apiClient.get('/trips/upcoming');
    return res.data;
  },
};
export default tripService;
