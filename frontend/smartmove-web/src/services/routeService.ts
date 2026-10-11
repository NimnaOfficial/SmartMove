import apiClient from '@/api/client';
import { RouteInfo, RouteFormData } from '@/types';
import { mockStore } from './mockDataStore';

const routeService = {
  getAll: async (): Promise<RouteInfo[]> => {
    try {
      const res = await apiClient.get('/routes');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return mockStore.getRoutes();
    } catch {
      return mockStore.getRoutes();
    }
  },
  getById: async (id: number): Promise<RouteInfo> => {
    try {
      const res = await apiClient.get(`/routes/${id}`);
      return res.data;
    } catch {
      const found = mockStore.getRoutes().find(r => r.routeId === id);
      if (found) return found;
      throw new Error('Route not found');
    }
  },
  create: async (data: RouteFormData): Promise<RouteInfo> => {
    try {
      const res = await apiClient.post('/routes', data);
      mockStore.saveRoute(res.data || data);
      return res.data;
    } catch {
      return mockStore.saveRoute(data);
    }
  },
  update: async (id: number, data: RouteFormData): Promise<RouteInfo> => {
    try {
      const res = await apiClient.put(`/routes/${id}`, data);
      mockStore.saveRoute({ ...data, routeId: id });
      return res.data;
    } catch {
      return mockStore.saveRoute({ ...data, routeId: id });
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/routes/${id}`);
    } catch {}
    mockStore.deleteRoute(id);
  },
  search: async (query: string): Promise<RouteInfo[]> => {
    try {
      const res = await apiClient.get(`/routes/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      const q = query.toLowerCase();
      return mockStore.getRoutes().filter(r =>
        (r.origin || '').toLowerCase().includes(q) ||
        (r.destination || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q)
      );
    }
  },
};

export default routeService;
