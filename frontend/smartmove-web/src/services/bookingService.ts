import apiClient from '@/api/client';
import { Booking, BookingFormData } from '@/types';
import { mockStore } from './mockDataStore';

const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    try {
      const res = await apiClient.get('/bookings');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return mockStore.getBookings();
    } catch {
      return mockStore.getBookings();
    }
  },
  getById: async (id: number): Promise<Booking> => {
    try {
      const res = await apiClient.get(`/bookings/${id}`);
      return res.data;
    } catch {
      const found = mockStore.getBookings().find(b => b.bookingId === id);
      if (found) return found;
      throw new Error('Booking not found');
    }
  },
  create: async (data: BookingFormData): Promise<Booking> => {
    try {
      const res = await apiClient.post('/bookings', data);
      return res.data;
    } catch {
      const list = mockStore.getBookings();
      const trips = mockStore.getTrips();
      const trip = trips.find(t => t.tripId === data.tripId);
      const newId = list.length > 0 ? Math.max(...list.map(b => b.bookingId)) + 1 : 501;
      const amount = (trip?.fare || 1000) * data.ticketQuantity;
      const newBooking: Booking = {
        bookingId: newId,
        passengerId: data.passengerId,
        passengerName: 'Passenger #' + data.passengerId,
        tripId: data.tripId,
        routeOrigin: trip?.routeOrigin || 'Origin',
        routeDestination: trip?.routeDestination || 'Destination',
        departureDate: trip?.departureDate || new Date().toISOString().split('T')[0],
        departureTime: trip?.departureTime || '08:00',
        ticketQuantity: data.ticketQuantity,
        totalAmount: amount,
        bookingStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString()
      };
      list.unshift(newBooking);
      localStorage.setItem('smartmove_bookings', JSON.stringify(list));
      return newBooking;
    }
  },
  cancel: async (id: number): Promise<Booking> => {
    try {
      const res = await apiClient.put(`/bookings/${id}/cancel`);
      mockStore.cancelBooking(id);
      return res.data;
    } catch {
      return mockStore.cancelBooking(id);
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/bookings/${id}`);
    } catch {}
    mockStore.deleteBooking(id);
  },
  getMyBookings: async (): Promise<Booking[]> => {
    try {
      const res = await apiClient.get('/bookings/my-bookings');
      return res.data;
    } catch {
      return mockStore.getBookings();
    }
  },
  search: async (query: string): Promise<Booking[]> => {
    try {
      const res = await apiClient.get(`/bookings/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      const q = query.toLowerCase();
      return mockStore.getBookings().filter(b =>
        b.bookingId.toString().includes(q) ||
        (b.passengerName || '').toLowerCase().includes(q) ||
        (b.routeOrigin || '').toLowerCase().includes(q) ||
        (b.routeDestination || '').toLowerCase().includes(q)
      );
    }
  },
};

export default bookingService;
