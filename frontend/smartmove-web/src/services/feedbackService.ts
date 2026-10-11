import apiClient from '@/api/client';
import { Feedback, FeedbackFormData } from '@/types';
import { mockStore } from './mockDataStore';

const feedbackService = {
  getAll: async (): Promise<Feedback[]> => {
    try {
      const res = await apiClient.get('/feedback');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return mockStore.getFeedback();
    } catch {
      return mockStore.getFeedback();
    }
  },
  getById: async (id: number): Promise<Feedback> => {
    try {
      const res = await apiClient.get(`/feedback/${id}`);
      return res.data;
    } catch {
      const found = mockStore.getFeedback().find(f => f.feedbackId === id);
      if (found) return found;
      throw new Error('Feedback not found');
    }
  },
  submit: async (data: FeedbackFormData): Promise<Feedback> => {
    try {
      const res = await apiClient.post('/feedback', data);
      return res.data;
    } catch {
      const list = mockStore.getFeedback();
      const newId = list.length > 0 ? Math.max(...list.map(f => f.feedbackId)) + 1 : 701;
      const newFb: Feedback = {
        feedbackId: newId,
        passengerId: data.passengerId,
        passengerName: 'Passenger #' + data.passengerId,
        routeId: data.routeId,
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        rating: data.rating,
        comment: data.comment,
        type: (data.type as any) || 'REVIEW',
        createdAt: new Date().toISOString()
      };
      list.unshift(newFb);
      localStorage.setItem('smartmove_feedback', JSON.stringify(list));
      return newFb;
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/feedback/${id}`);
    } catch {}
    mockStore.deleteFeedback(id);
  },
  getByPassenger: async (passengerId: number): Promise<Feedback[]> => {
    try {
      const res = await apiClient.get(`/feedback/passenger/${passengerId}`);
      return res.data;
    } catch {
      return mockStore.getFeedback().filter(f => f.passengerId === passengerId);
    }
  },
  search: async (query: string): Promise<Feedback[]> => {
    try {
      const res = await apiClient.get(`/feedback/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      const q = query.toLowerCase();
      return mockStore.getFeedback().filter(f =>
        (f.comment || '').toLowerCase().includes(q) ||
        (f.passengerName || '').toLowerCase().includes(q) ||
        (f.routeName || '').toLowerCase().includes(q)
      );
    }
  },
};

export default feedbackService;
