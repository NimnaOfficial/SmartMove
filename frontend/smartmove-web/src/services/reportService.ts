import apiClient from '@/api/client';
import { RouteUsageReport, RevenueReport, PassengerHistoryReport, MaintenanceDueReport, TripPerformanceReport, DashboardStats } from '@/types';

const reportService = {
  getRouteUsage: async (): Promise<RouteUsageReport[]> => {
    const res = await apiClient.get('/reports/routes');
    return res.data;
  },
  getRevenue: async (startDate: string, endDate: string): Promise<RevenueReport> => {
    const res = await apiClient.get('/reports/revenue', { params: { startDate, endDate } });
    return res.data;
  },
  getPassengerHistory: async (passengerId: number): Promise<PassengerHistoryReport> => {
    const res = await apiClient.get(`/reports/passenger-history/${passengerId}`);
    return res.data;
  },
  getMaintenanceDue: async (): Promise<MaintenanceDueReport[]> => {
    const res = await apiClient.get('/reports/maintenance');
    return res.data;
  },
  getTripPerformance: async (): Promise<TripPerformanceReport[]> => {
    const res = await apiClient.get('/reports/trip-performance');
    return res.data;
  },
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get('/reports/dashboard');
    return res.data;
  },
};
export default reportService;
