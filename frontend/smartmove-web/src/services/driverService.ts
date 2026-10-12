import apiClient from '@/api/client';
import { Driver, DriverFormData } from '@/types';
import authService from './authService';
import tripService from './tripService';

const driverService = {
  getAll: async (): Promise<Driver[]> => {
    const res = await apiClient.get('/drivers');
    return Array.isArray(res.data) ? res.data : [];
  },
  getById: async (id: number): Promise<Driver> => {
    const res = await apiClient.get(`/drivers/${id}`);
    return res.data;
  },
  create: async (data: DriverFormData): Promise<Driver> => {
    const res = await apiClient.post('/drivers', data);
    return res.data;
  },
  update: async (id: number, data: DriverFormData): Promise<Driver> => {
    const res = await apiClient.put(`/drivers/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/drivers/${id}`);
  },
  getProfile: async (): Promise<Driver> => {
    const user = authService.getCurrentUser();
    const currentDriverId = Number(user?.userId || 1);

    // 1. First attempt to fetch this specific driver by ID from the API
    try {
      const driverRes = await apiClient.get(`/drivers/${currentDriverId}`);
      if (driverRes.data && (driverRes.data.driverId || driverRes.data.DRIVER_ID)) {
        return {
          driverId: currentDriverId,
          firstName: driverRes.data.firstName || driverRes.data.FIRST_NAME || user?.firstName || 'Driver',
          lastName: driverRes.data.lastName || driverRes.data.LAST_NAME || user?.lastName || '',
          email: driverRes.data.email || driverRes.data.EMAIL || user?.email || '',
          phone: driverRes.data.phone || driverRes.data.PHONE || user?.phone || '',
          licenseNumber: driverRes.data.licenseNumber || driverRes.data.LICENSE_NUMBER || (user as any)?.licenseNumber || `B${1000000 + currentDriverId}`,
          status: driverRes.data.status || driverRes.data.STATUS || 'ACTIVE',
          rating: Number(driverRes.data.rating ?? driverRes.data.RATING ?? (user as any)?.rating ?? 5.0),
          totalTrips: Number(driverRes.data.totalTrips ?? driverRes.data.TOTAL_TRIPS ?? (user as any)?.totalTrips ?? 0),
          role: 'DRIVER',
        };
      }
    } catch (e) {}

    // 2. Fallback strictly to the logged-in driver's own stored attributes
    return {
      driverId: currentDriverId,
      firstName: user?.firstName || 'Driver',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      licenseNumber: (user as any)?.licenseNumber || `B${1000000 + currentDriverId}`,
      status: (user as any)?.status || 'ACTIVE',
      rating: Number((user as any)?.rating ?? 5.0),
      totalTrips: Number((user as any)?.totalTrips ?? 0),
      role: 'DRIVER',
    };
  },
  updateProfile: async (data: Partial<DriverFormData>): Promise<Driver> => {
    const res = await apiClient.put('/drivers/profile', data);
    return res.data;
  },
  getMyTrips: async (): Promise<any[]> => {
    const user = authService.getCurrentUser();
    const currentDriverId = Number(user?.userId || 1);

    // Strictly fetch and filter only trips assigned to THIS driver
    try {
      const allTrips = await tripService.getAll();
      if (Array.isArray(allTrips)) {
        const myTrips = allTrips.filter((t: any) => {
          const tripDriverId = Number(t.driverId ?? t.DRIVER_ID ?? 0);
          return tripDriverId === currentDriverId;
        });
        return myTrips;
      }
    } catch (e) {}
    return [];
  },
  search: async (query: string): Promise<Driver[]> => {
    const res = await apiClient.get(`/drivers/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  updateTripStatus: async (tripId: number, status: string): Promise<any> => {
    return tripService.updateStatus(tripId, status);
  },
  changePassword: async (newPassword: string): Promise<boolean> => {
    return authService.changePassword(newPassword);
  },
};

export default driverService;
