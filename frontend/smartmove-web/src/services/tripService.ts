import apiClient from '@/api/client';
import { Trip, TripFormData } from '@/types';
import { mockStore } from './mockDataStore';

const tripService = {
  getAll: async (): Promise<Trip[]> => {
    try {
      const res = await apiClient.get('/trips');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return mockStore.getTrips();
    } catch {
      return mockStore.getTrips();
    }
  },
  getById: async (id: number): Promise<Trip> => {
    try {
      const res = await apiClient.get(`/trips/${id}`);
      return res.data;
    } catch {
      const found = mockStore.getTrips().find(t => t.tripId === id);
      if (found) return found;
      throw new Error('Trip not found');
    }
  },
  create: async (data: TripFormData): Promise<Trip> => {
    try {
      const res = await apiClient.post('/trips', data);
      mockStore.saveTrip(res.data || data);
      return res.data;
    } catch {
      return mockStore.saveTrip(data);
    }
  },
  update: async (id: number, data: Partial<TripFormData>): Promise<Trip> => {
    try {
      const res = await apiClient.put(`/trips/${id}`, data);
      mockStore.saveTrip({ ...data, tripId: id } as any);
      return res.data;
    } catch {
      return mockStore.saveTrip({ ...data, tripId: id } as any);
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/trips/${id}`);
    } catch {}
    mockStore.deleteTrip(id);
  },
  updateStatus: async (id: number, status: string): Promise<Trip> => {
    try {
      const res = await apiClient.patch(`/trips/${id}/status`, { status });
      mockStore.saveTrip({ tripId: id, status: status as any });
      return res.data;
    } catch {
      return mockStore.saveTrip({ tripId: id, status: status as any });
    }
  },
  search: async (params: { origin?: string; destination?: string; date?: string; maxPrice?: number }): Promise<Trip[]> => {
    try {
      const res = await apiClient.get('/trips/search', { params });
      return res.data;
    } catch {
      return mockStore.getTrips().filter(t => {
        if (params.origin && !t.routeOrigin?.toLowerCase().includes(params.origin.toLowerCase())) return false;
        if (params.destination && !t.routeDestination?.toLowerCase().includes(params.destination.toLowerCase())) return false;
        if (params.date && t.departureDate !== params.date) return false;
        if (params.maxPrice && t.fare > params.maxPrice) return false;
        return true;
      });
    }
  },
  getUpcoming: async (): Promise<Trip[]> => {
    try {
      const res = await apiClient.get('/trips/upcoming');
      return res.data;
    } catch {
      return mockStore.getTrips().filter(t => t.status === 'SCHEDULED');
    }
  },
};

export default tripService;
