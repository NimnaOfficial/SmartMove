import apiClient from '@/api/client';
import { Maintenance, MaintenanceFormData } from '@/types';
import { mockStore } from './mockDataStore';

const maintenanceService = {
  getAll: async (): Promise<Maintenance[]> => {
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
    try {
      const res = await apiClient.get(`/maintenance/${id}`);
      return res.data;
    } catch {
      const found = mockStore.getMaintenance().find(m => m.maintenanceId === id);
      if (found) return found;
      throw new Error('Maintenance record not found');
    }
  },
  create: async (data: MaintenanceFormData): Promise<Maintenance> => {
    try {
      const res = await apiClient.post('/maintenance', data);
      mockStore.saveMaintenance(res.data || data);
      return res.data;
    } catch {
      return mockStore.saveMaintenance(data);
    }
  },
  update: async (id: number, data: MaintenanceFormData): Promise<Maintenance> => {
    try {
      const res = await apiClient.put(`/maintenance/${id}`, data);
      mockStore.saveMaintenance({ ...data, maintenanceId: id });
      return res.data;
    } catch {
      return mockStore.saveMaintenance({ ...data, maintenanceId: id });
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/maintenance/${id}`);
    } catch {}
    mockStore.deleteMaintenance(id);
  },
  getDueVehicles: async (): Promise<Maintenance[]> => {
    try {
      const res = await apiClient.get('/maintenance/due');
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getMaintenance().filter(m => m.status === 'SCHEDULED' || m.status === 'OVERDUE');
    } catch {
      return mockStore.getMaintenance().filter(m => m.status === 'SCHEDULED' || m.status === 'OVERDUE');
    }
  },
  search: async (query: string): Promise<Maintenance[]> => {
    try {
      const res = await apiClient.get(`/maintenance/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      const q = query.toLowerCase();
      return mockStore.getMaintenance().filter(m =>
        (m.vehicleRegistration || '').toLowerCase().includes(q) ||
        (m.type || '').toLowerCase().includes(q) ||
        (m.technician || '').toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q)
      );
    }
  },
};

export default maintenanceService;
