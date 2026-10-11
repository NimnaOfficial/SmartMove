import apiClient from '@/api/client';
import { Driver, DriverFormData } from '@/types';
import { mockStore } from './mockDataStore';
import authService from './authService';

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
      if (res.data) return res.data;
    } catch {}

    const currentUser = authService.getCurrentUser();
    const drivers = mockStore.getDrivers();
    if (currentUser) {
      const byId = drivers.find(d => d.driverId === currentUser.userId);
      if (byId) return byId;
      const byEmail = drivers.find(d => d.email.toLowerCase() === (currentUser.email || '').toLowerCase());
      if (byEmail) return byEmail;
    }
    return drivers[0] || {
      driverId: 201,
      firstName: 'Kamal',
      lastName: 'Perera',
      email: 'kamal.perera@smartmove.lk',
      phone: '+94 77 123 4567',
      licenseNumber: 'B8291041',
      status: 'ACTIVE'
    };
  },
  updateProfile: async (data: Partial<DriverFormData>): Promise<Driver> => {
    try {
      const res = await apiClient.put('/drivers/profile', data);
      if (res.data) return res.data;
    } catch {}
    const profile = await driverService.getProfile();
    return mockStore.saveDriver({ ...profile, ...data });
  },
  getMyTrips: async (): Promise<any[]> => {
    try {
      const res = await apiClient.get('/drivers/my-trips');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
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
