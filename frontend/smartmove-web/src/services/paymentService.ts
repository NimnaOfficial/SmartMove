import apiClient from '@/api/client';
import { Payment, PaymentFormData } from '@/types';

const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    const res = await apiClient.get('/payments');
    return res.data;
  },
  getById: async (id: number): Promise<Payment> => {
    const res = await apiClient.get(`/payments/${id}`);
    return res.data;
  },
  processPayment: async (data: PaymentFormData): Promise<Payment> => {
    const res = await apiClient.post('/payments', data);
    return res.data;
  },
  getByBooking: async (bookingId: number): Promise<Payment> => {
    const res = await apiClient.get(`/payments/booking/${bookingId}`);
    return res.data;
  },
};
export default paymentService;
