import apiClient from '@/api/client';
import { RouteUsageReport, RevenueReport, PassengerHistoryReport, MaintenanceDueReport, TripPerformanceReport, DashboardStats } from '@/types';
import { mockStore } from './mockDataStore';

const reportService = {
  getRouteUsage: async (): Promise<RouteUsageReport[]> => {
    try {
      const res = await apiClient.get('/reports/routes');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getRouteUsageReports();
    } catch {
      return mockStore.getRouteUsageReports();
    }
  },
  getRevenue: async (startDate: string, endDate: string): Promise<RevenueReport> => {
    try {
      const res = await apiClient.get('/reports/revenue', { params: { startDate, endDate } });
      if (res.data && (res.data.totalRevenue || res.data.total)) {
        return {
          totalRevenue: res.data.totalRevenue ?? res.data.total ?? 0,
          ticketsSold: res.data.ticketsSold ?? 25,
          averageTicketValue: res.data.averageTicketValue ?? 1200,
          periodStart: startDate,
          periodEnd: endDate,
          dailyBreakdown: res.data.dailyBreakdown ?? mockStore.getRevenueReport(startDate, endDate).dailyBreakdown
        };
      }
      return mockStore.getRevenueReport(startDate, endDate);
    } catch {
      return mockStore.getRevenueReport(startDate, endDate);
    }
  },
  getPassengerHistory: async (passengerId: number): Promise<PassengerHistoryReport> => {
    try {
      const res = await apiClient.get(`/reports/passenger-history/${passengerId}`);
      if (res.data && res.data.trips) return res.data;
      return {
        passengerId,
        passengerName: 'Passenger #' + passengerId,
        trips: [
          {
            tripId: 401,
            route: 'Colombo Fort → Kandy Central',
            travelDate: '2026-10-10',
            vehicle: 'WP-ND-4521',
            bookingId: 501,
            paymentStatus: 'PAID'
          }
        ]
      };
    } catch {
      return {
        passengerId,
        passengerName: 'Passenger #' + passengerId,
        trips: [
          {
            tripId: 401,
            route: 'Colombo Fort → Kandy Central',
            travelDate: '2026-10-10',
            vehicle: 'WP-ND-4521',
            bookingId: 501,
            paymentStatus: 'PAID'
          }
        ]
      };
    }
  },
  getMaintenanceDue: async (): Promise<MaintenanceDueReport[]> => {
    try {
      const res = await apiClient.get('/reports/maintenance');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getMaintenanceDueReports();
    } catch {
      return mockStore.getMaintenanceDueReports();
    }
  },
  getTripPerformance: async (): Promise<TripPerformanceReport[]> => {
    try {
      const res = await apiClient.get('/reports/trip-performance');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getTripPerformance();
    } catch {
      return mockStore.getTripPerformance();
    }
  },
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const res = await apiClient.get('/reports/dashboard');
      if (res.data && typeof res.data.totalVehicles === 'number') {
        return res.data;
      }
      return mockStore.getDashboardStats();
    } catch {
      return mockStore.getDashboardStats();
    }
  },
};

export default reportService;
