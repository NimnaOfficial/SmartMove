import apiClient from '@/api/client';
import { RouteInfo, RouteFormData } from '@/types';

const routeService = {
  getAll: async (): Promise<RouteInfo[]> => {
    const res = await apiClient.get('/routes');
    return res.data;
  },
  getById: async (id: number): Promise<RouteInfo> => {
    const res = await apiClient.get(`/routes/${id}`);
    return res.data;
  },
  create: async (data: RouteFormData): Promise<RouteInfo> => {
    const res = await apiClient.post('/routes', data);
    return res.data;
  },
  update: async (id: number, data: RouteFormData): Promise<RouteInfo> => {
    const res = await apiClient.put(`/routes/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/routes/${id}`);
  },
  search: async (query: string): Promise<RouteInfo[]> => {
    const res = await apiClient.get(`/routes/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default routeService;
