import apiClient from '@/api/client';
import { Trip, TripFormData } from '@/types';

const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const res = await apiClient.get('/trips');
    return Array.isArray(res.data) ? res.data : [];
  },
  getById: async (id: number): Promise<Trip> => {
    const res = await apiClient.get(`/trips/${id}`);
    return res.data;
  },
  create: async (data: TripFormData): Promise<Trip> => {
    let departureIso = data.departureTime;
    if (data.departureDate && data.departureTime) {
      if (!data.departureTime.includes('T')) {
        const timePart = data.departureTime.length === 5 ? `${data.departureTime}:00` : data.departureTime;
        departureIso = `${data.departureDate}T${timePart}`;
      }
    }
    const payload: any = {
      ...data,
      departureTime: departureIso,
    };
    if (!payload.arrivalTime && departureIso) {
      try {
        const depDate = new Date(departureIso);
        const arrDate = new Date(depDate.getTime() + 2 * 3600 * 1000); // 2 hours default duration
        payload.arrivalTime = arrDate.toISOString().replace('.000Z', '');
      } catch {}
    }
    if (payload.availableSeats === undefined || payload.availableSeats === null) {
      payload.availableSeats = 45;
    }
    const res = await apiClient.post('/trips', payload);
    return res.data;
  },
  update: async (id: number, data: Partial<TripFormData>): Promise<Trip> => {
    let departureIso = data.departureTime;
    if (data.departureDate && data.departureTime && !data.departureTime.includes('T')) {
      const timePart = data.departureTime.length === 5 ? `${data.departureTime}:00` : data.departureTime;
      departureIso = `${data.departureDate}T${timePart}`;
    }
    const payload: any = {
      ...data,
      ...(departureIso ? { departureTime: departureIso } : {})
    };
    const res = await apiClient.put(`/trips/${id}`, payload);
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
  acceptTrip: async (id: number): Promise<Trip> => {
    const res = await apiClient.post(`/trips/${id}/accept`, {});
    return res.data;
  },
};

export default tripService;
