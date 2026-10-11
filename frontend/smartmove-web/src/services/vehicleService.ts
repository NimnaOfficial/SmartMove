import apiClient from '@/api/client';
import { Vehicle, VehicleFormData } from '@/types';
import { mockStore } from './mockDataStore';

const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    try {
      const res = await apiClient.get('/vehicles');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return mockStore.getVehicles();
    } catch {
      return mockStore.getVehicles();
    }
  },
  getById: async (id: number): Promise<Vehicle> => {
    try {
      const res = await apiClient.get(`/vehicles/${id}`);
      return res.data;
    } catch {
      const found = mockStore.getVehicles().find(v => v.vehicleId === id);
      if (found) return found;
      throw new Error('Vehicle not found');
    }
  },
  create: async (data: VehicleFormData): Promise<Vehicle> => {
    try {
      const res = await apiClient.post('/vehicles', data);
      mockStore.saveVehicle(res.data || data);
      return res.data;
    } catch {
      return mockStore.saveVehicle(data);
    }
  },
  update: async (id: number, data: VehicleFormData): Promise<Vehicle> => {
    try {
      const res = await apiClient.put(`/vehicles/${id}`, data);
      mockStore.saveVehicle({ ...data, vehicleId: id });
      return res.data;
    } catch {
      return mockStore.saveVehicle({ ...data, vehicleId: id });
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/vehicles/${id}`);
    } catch {}
    mockStore.deleteVehicle(id);
  },
  search: async (query: string): Promise<Vehicle[]> => {
    try {
      const res = await apiClient.get(`/vehicles/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      const q = query.toLowerCase();
      return mockStore.getVehicles().filter(v =>
        (v.registrationNumber || '').toLowerCase().includes(q) ||
        (v.model || '').toLowerCase().includes(q) ||
        (v.type || '').toLowerCase().includes(q)
      );
    }
  },
};

export default vehicleService;
