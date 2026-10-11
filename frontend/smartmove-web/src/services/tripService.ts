import apiClient from '@/api/client';
import { Trip, TripFormData } from '@/types';

const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const res = await apiClient.get('/trips');
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/trips');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return mockStore.getTrips();
    } catch {
      return mockStore.getTrips();
    }
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
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/trips/${id}`);
  },
  updateStatus: async (id: number, status: string): Promise<Trip> => {
    const res = await apiClient.patch(`/trips/${id}/status`, { status });
    return res.data;
  },
  search: async (params: { origin?: string; destination?: string; date?: string; maxPrice?: number }): Promise<Trip[]> => {
    const res = await apiClient.get('/trips/search', { params });
    return Array.isArray(res.data) ? res.data : [];
  },
  getUpcoming: async (): Promise<Trip[]> => {
    const res = await apiClient.get('/trips/upcoming');
    return Array.isArray(res.data) ? res.data : [];
  },
};

export default tripService;
