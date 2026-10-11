import apiClient from '@/api/client';
import { Feedback, FeedbackFormData } from '@/types';

const feedbackService = {
  getAll: async (): Promise<Feedback[]> => {
    const res = await apiClient.get('/feedback');
    return Array.isArray(res.data) ? res.data : [];
  },
  getById: async (id: number): Promise<Feedback> => {
    const res = await apiClient.get(`/feedback/${id}`);
    return res.data;
  },
  submit: async (data: FeedbackFormData): Promise<Feedback> => {
    const res = await apiClient.post('/feedback', data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/feedback/${id}`);
  },
  getByPassenger: async (passengerId: number): Promise<Feedback[]> => {
    const res = await apiClient.get(`/feedback/passenger/${passengerId}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  search: async (query: string): Promise<Feedback[]> => {
    const res = await apiClient.get(`/feedback/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(res.data) ? res.data : [];
  },
};

export default feedbackService;
