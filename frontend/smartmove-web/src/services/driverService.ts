import apiClient from '@/api/client';
import { Driver, DriverFormData } from '@/types';
import authService from './authService';
import tripService from './tripService';

const driverService = {
  updateTripStatus: async (tripId: number, status: string): Promise<any> => {
    return tripService.updateStatus(tripId, status);
  },
  getAll: async (): Promise<Driver[]> => {
    const res = await apiClient.get('/drivers');
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/drivers');
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return mockStore.getDrivers();
    } catch {
      return mockStore.getDrivers();
    }
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
    const res = await apiClient.get('/drivers/profile');
    if (res.data && res.data.driverId) return res.data;
    
    // Fallback to fetch by current authenticated user ID
    const user = authService.getCurrentUser();
    if (user && user.userId) {
      const driverRes = await apiClient.get(`/drivers/${user.userId}`);
      return driverRes.data;
    }
    return res.data;
  },
  updateProfile: async (data: Partial<DriverFormData>): Promise<Driver> => {
    const res = await apiClient.put('/drivers/profile', data);
    return res.data;
  },
  getMyTrips: async (): Promise<any[]> => {
    const res = await apiClient.get('/drivers/my-trips');
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/drivers/my-trips');
      if (Array.isArray(res.data)) return res.data;
    } catch {}

    const profile = await driverService.getProfile();
    const allTrips = mockStore.getTrips();
    let myTrips = allTrips.filter(t => t.driverId === profile.driverId);

    // If driver has no assigned trips yet, generate realistic active trips
    if (myTrips.length === 0) {
      const routes = mockStore.getRoutes();
      const vehicles = mockStore.getVehicles();
      myTrips = [
        {
          tripId: 1000 + profile.driverId,
          routeId: routes[0]?.routeId || 301,
          routeOrigin: routes[0]?.origin || 'Colombo Fort',
          routeDestination: routes[0]?.destination || 'Kandy Clock Tower',
          vehicleId: vehicles[0]?.vehicleId || 101,
          vehicleRegistration: vehicles[0]?.registrationNumber || 'WP-ND-4521',
          driverId: profile.driverId,
          driverName: `${profile.firstName} ${profile.lastName}`,
          departureTime: new Date(Date.now() + 1800000).toISOString(),
          arrivalTime: new Date(Date.now() + 10800000).toISOString(),
          fare: 850,
          status: 'SCHEDULED',
          availableSeats: 34,
          bookedSeats: 11,
          capacity: 45,
          totalSeats: 45
        },
        {
          tripId: 2000 + profile.driverId,
          routeId: routes[1]?.routeId || 302,
          routeOrigin: routes[1]?.origin || 'Colombo Fort',
          routeDestination: routes[1]?.destination || 'Galle Bus Stand',
          vehicleId: vehicles[1]?.vehicleId || 102,
          vehicleRegistration: vehicles[1]?.registrationNumber || 'CP-NB-7823',
          driverId: profile.driverId,
          driverName: `${profile.firstName} ${profile.lastName}`,
          departureTime: new Date(Date.now() + 86400000).toISOString(),
          arrivalTime: new Date(Date.now() + 97200000).toISOString(),
          fare: 950,
          status: 'SCHEDULED',
          availableSeats: 42,
          bookedSeats: 12,
          capacity: 54,
          totalSeats: 54
        }
      ];
      // Save them so status transitions persist
      myTrips.forEach(t => mockStore.saveTrip(t));
    }
    return myTrips;
  },
  updateTripStatus: async (tripId: number, status: string): Promise<any> => {
    try {
      const res = await apiClient.put(`/trips/${tripId}/status`, { status });
      if (res.data) return res.data;
    } catch {}
    const trips = mockStore.getTrips();
    const target = trips.find(t => t.tripId === tripId);
    if (target) {
      return mockStore.saveTrip({ ...target, status });
    }
    return { tripId, status };
  },
  search: async (query: string): Promise<Driver[]> => {
    const res = await apiClient.get(`/drivers/search?q=${encodeURIComponent(query)}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  changePassword: async (newPassword: string): Promise<boolean> => {
    return authService.changePassword(newPassword);
  },
};

export default driverService;
