import apiClient from '@/api/client';
import { Feedback, FeedbackFormData } from '@/types';

const feedbackService = {
  getAll: async (): Promise<Feedback[]> => {
    const res = await apiClient.get('/feedback');
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/feedback');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return mockStore.getFeedback();
    } catch {
      return mockStore.getFeedback();
    }
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
