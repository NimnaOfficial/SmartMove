import apiClient from '@/api/client';
import { Driver, DriverFormData } from '@/types';
import { mockStore } from './mockDataStore';

const driverService = {
  getAll: async (): Promise<Driver[]> => {
    try {
      const res = await apiClient.get('/drivers');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return mockStore.getDrivers();
    } catch {
      return mockStore.getDrivers();
    }
  },
  getById: async (id: number): Promise<Driver> => {
    try {
      const res = await apiClient.get(`/drivers/${id}`);
      return res.data;
    } catch {
      const found = mockStore.getDrivers().find(d => d.driverId === id);
      if (found) return found;
      throw new Error('Driver not found');
    }
  },
  create: async (data: DriverFormData): Promise<Driver> => {
    try {
      const res = await apiClient.post('/drivers', data);
      mockStore.saveDriver(res.data || data);
      return res.data;
    } catch {
      return mockStore.saveDriver(data);
    }
  },
  update: async (id: number, data: DriverFormData): Promise<Driver> => {
    try {
      const res = await apiClient.put(`/drivers/${id}`, data);
      mockStore.saveDriver({ ...data, driverId: id });
      return res.data;
    } catch {
      return mockStore.saveDriver({ ...data, driverId: id });
    }
  },
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/drivers/${id}`);
    } catch {}
    mockStore.deleteDriver(id);
  },
  getProfile: async (): Promise<Driver> => {
    try {
      const res = await apiClient.get('/drivers/profile');
      return res.data;
    } catch {
      return mockStore.getDrivers()[0];
    }
  },
  updateProfile: async (data: Partial<DriverFormData>): Promise<Driver> => {
    try {
      const res = await apiClient.put('/drivers/profile', data);
      return res.data;
    } catch {
      const first = mockStore.getDrivers()[0];
      return mockStore.saveDriver({ ...first, ...data });
    }
  },
  getMyTrips: async (): Promise<any[]> => {
    try {
      const res = await apiClient.get('/drivers/my-trips');
      return res.data;
    } catch {
      return mockStore.getTrips().filter(t => t.driverId === 201);
    }
  },
  search: async (query: string): Promise<Driver[]> => {
    try {
      const res = await apiClient.get(`/drivers/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      const q = query.toLowerCase();
      return mockStore.getDrivers().filter(d =>
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
        (d.licenseNumber || '').toLowerCase().includes(q) ||
        (d.email || '').toLowerCase().includes(q)
      );
    }
  },
};

export default driverService;
