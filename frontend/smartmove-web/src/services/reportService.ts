import apiClient from '@/api/client';
import { RouteUsageReport, RevenueReport, PassengerHistoryReport, MaintenanceDueReport, TripPerformanceReport, DashboardStats } from '@/types';

const reportService = {
  getRouteUsage: async (): Promise<RouteUsageReport[]> => {
    const res = await apiClient.get('/reports/routes');
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/reports/routes');
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getRouteUsageReports();
    } catch {
      return mockStore.getRouteUsageReports();
    }
  },
  getRevenue: async (startDate: string, endDate: string): Promise<RevenueReport> => {
    const res = await apiClient.get('/reports/revenue', { params: { startDate, endDate } });
    return res.data || {
      totalRevenue: 0,
      ticketsSold: 0,
      averageTicketValue: 0,
      periodStart: startDate,
      periodEnd: endDate,
      dailyBreakdown: []
    };
  },
  getPassengerHistory: async (passengerId: number): Promise<PassengerHistoryReport> => {
    const res = await apiClient.get(`/reports/passenger-history/${passengerId}`);
    return res.data || {
      passengerId,
      passengerName: 'Passenger #' + passengerId,
      trips: []
    };
  },
  getMaintenanceDue: async (): Promise<MaintenanceDueReport[]> => {
    const res = await apiClient.get('/reports/maintenance');
    return Array.isArray(res.data) ? res.data : [];
  },
  getTripPerformance: async (): Promise<TripPerformanceReport[]> => {
    const res = await apiClient.get('/reports/trip-performance');
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/reports/maintenance');
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getMaintenanceDueReports();
    } catch {
      return mockStore.getMaintenanceDueReports();
    }
  },
  getTripPerformance: async (): Promise<TripPerformanceReport[]> => {
    try {
      const res = await apiClient.get('/reports/trip-performance');
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getTripPerformance();
    } catch {
      return mockStore.getTripPerformance();
    }
  },
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get('/reports/dashboard');
    return res.data || {
      totalPassengers: 0,
      totalDrivers: 0,
      totalVehicles: 0,
      activeTrips: 0,
      monthlyRevenue: 0,
      fleetUtilization: 0
    };
  },
};

export default reportService;
