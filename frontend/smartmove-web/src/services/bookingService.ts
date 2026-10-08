import apiClient from '@/api/client';
import { Booking, BookingFormData } from '@/types';

const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const res = await apiClient.get('/bookings');
    return res.data;
  },
  getById: async (id: number): Promise<Booking> => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
  },
  create: async (data: BookingFormData): Promise<Booking> => {
    const res = await apiClient.post('/bookings', data);
    return res.data;
  },
  cancel: async (id: number): Promise<Booking> => {
    const res = await apiClient.put(`/bookings/${id}/cancel`);
    return res.data;
  },
  getMyBookings: async (): Promise<Booking[]> => {
    const res = await apiClient.get('/bookings/my-bookings');
    return res.data;
  },
  search: async (query: string): Promise<Booking[]> => {
    const res = await apiClient.get(`/bookings/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default bookingService;
