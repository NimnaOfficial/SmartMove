import apiClient from '@/api/client';
import { Maintenance, MaintenanceFormData } from '@/types';

const maintenanceService = {
  getAll: async (): Promise<Maintenance[]> => {
    const res = await apiClient.get('/maintenance');
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/maintenance');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return mockStore.getMaintenance();
    } catch {
      return mockStore.getMaintenance();
    }
  },
  getById: async (id: number): Promise<Maintenance> => {
    const res = await apiClient.get(`/maintenance/${id}`);
    return res.data;
  },
  create: async (data: MaintenanceFormData): Promise<Maintenance> => {
    const res = await apiClient.post('/maintenance', data);
    return res.data;
  },
  update: async (id: number, data: MaintenanceFormData): Promise<Maintenance> => {
    const res = await apiClient.put(`/maintenance/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/maintenance/${id}`);
  },
  getDueVehicles: async (): Promise<Maintenance[]> => {
    const res = await apiClient.get('/maintenance/due');
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/maintenance/due');
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getMaintenance().filter(m => m.status === 'SCHEDULED' || m.status === 'OVERDUE');
    } catch {
      return mockStore.getMaintenance().filter(m => m.status === 'SCHEDULED' || m.status === 'OVERDUE');
    }
  },
  search: async (query: string): Promise<Maintenance[]> => {
    const res = await apiClient.get(`/maintenance/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(res.data) ? res.data : [];
  },
};

export default maintenanceService;
