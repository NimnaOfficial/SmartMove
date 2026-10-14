import apiClient from '@/api/client';
import { Passenger, PassengerFormData } from '@/types';

const passengerService = {
  getAll: async (): Promise<Passenger[]> => {
    const res = await apiClient.get('/passengers');
    return res.data;
  },
  getById: async (id: number): Promise<Passenger> => {
    const res = await apiClient.get(`/passengers/${id}`);
    return res.data;
  },
  update: async (id: number, data: PassengerFormData): Promise<Passenger> => {
    const res = await apiClient.put(`/passengers/${id}`, data);
    return res.data;
  },
  getProfile: async (passengerId?: number): Promise<Passenger> => {
    const userStr = localStorage.getItem('smartmove_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const effectiveId = passengerId || (user as any)?.passengerId || user?.userId || user?.id;
    if (!effectiveId) {
      throw new Error('User not logged in');
    }
    const res = await apiClient.get('/passengers/profile', {
      params: { passengerId: effectiveId, userId: effectiveId },
      headers: { 'X-User-Id': effectiveId.toString() }
    });
    return res.data;
  },
  updateProfile: async (data: any): Promise<Passenger> => {
    const userStr = localStorage.getItem('smartmove_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const effectiveId = data.passengerId || (user as any)?.passengerId || user?.userId || user?.id;
    if (!effectiveId) {
      throw new Error('User not logged in');
    }
    const payload = {
      ...data,
      passengerId: effectiveId
    };
    const res = await apiClient.put('/passengers/profile', payload, {
      params: { passengerId: effectiveId, userId: effectiveId },
      headers: { 'X-User-Id': effectiveId.toString() }
    });
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/passengers/${id}`);
  },
  search: async (query: string): Promise<Passenger[]> => {
    const res = await apiClient.get(`/passengers/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default passengerService;
