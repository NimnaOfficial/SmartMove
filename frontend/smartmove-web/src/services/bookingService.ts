import apiClient from '@/api/client';
import { Booking, BookingFormData } from '@/types';

const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const res = await apiClient.get('/bookings');
    return Array.isArray(res.data) ? res.data : [];
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
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },
  getMyBookings: async (passengerId?: number): Promise<Booking[]> => {
    try {
      const userStr = localStorage.getItem('smartmove_user');
      const user = userStr ? JSON.parse(userStr) : null;
      const effectiveId = passengerId || user?.userId || user?.passengerId || user?.id || 1;
      const res = await apiClient.get('/bookings/my-bookings', {
        params: { passengerId: effectiveId, userId: effectiveId }
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch {
      return [];
    }
  },
  search: async (query: string): Promise<Booking[]> => {
    const res = await apiClient.get(`/bookings/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  updateStatus: async (id: number, status: string): Promise<Booking> => {
    const res = await apiClient.patch(`/bookings/${id}/status`, { status });
    return res.data;
  },
  updatePaymentStatus: async (id: number, paymentStatus: string): Promise<Booking> => {
    const res = await apiClient.patch(`/bookings/${id}/payment`, { paymentStatus });
    return res.data;
  },
  acceptBooking: async (id: number): Promise<Booking> => {
    const res = await apiClient.put(`/bookings/${id}/accept`);
    return res.data;
  },
  getByTrip: async (tripId: number): Promise<Booking[]> => {
    const res = await apiClient.get(`/bookings/trip/${tripId}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  acceptTripBookings: async (tripId: number): Promise<any> => {
    const res = await apiClient.put(`/bookings/trip/${tripId}/accept`);
    return res.data;
  },
};

export default bookingService;
