import apiClient from '@/api/client';
import { RouteUsageReport, RevenueReport, PassengerHistoryReport, MaintenanceDueReport, TripPerformanceReport, DashboardStats } from '@/types';

const reportService = {
  getRouteUsage: async (): Promise<RouteUsageReport[]> => {
    const res = await apiClient.get('/reports/routes');
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map((item: any) => ({
      routeId: Number(item.routeId ?? item.ROUTE_ID ?? item.route_id ?? 0),
      origin: String(item.origin ?? item.ORIGIN ?? ''),
      destination: String(item.destination ?? item.DESTINATION ?? ''),
      bookingCount: Number(item.bookingCount ?? item.TOTAL_BOOKINGS ?? item.total_bookings ?? 0),
      rank: Number(item.rank ?? item.RANKING ?? item.ranking ?? 1),
    }));
  },
  getRevenue: async (startDate: string, endDate: string): Promise<RevenueReport> => {
    const res = await apiClient.get('/reports/revenue', { params: { startDate, endDate } });
    const d = res.data || {};
    const totalRevenue = Number(d.totalRevenue ?? d.TOTAL ?? d.total ?? 0);
    const ticketsSold = Number(d.ticketsSold ?? d.TICKETS_SOLD ?? d.tickets_sold ?? 0);
    const averageTicketValue = Number(d.averageTicketValue ?? d.AVG_TICKET ?? d.avg_ticket ?? 0);
    return {
      totalRevenue,
      ticketsSold,
      averageTicketValue,
      periodStart: startDate,
      periodEnd: endDate,
      dailyBreakdown: d.dailyBreakdown || []
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
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map((m: any) => {
      const lastDate = m.lastMaintenance ?? m.LAST_MAINTENANCE_DATE ?? m.last_maintenance_date ?? '';
      const nextDate = m.nextMaintenance ?? m.DUE_DATE ?? m.due_date ?? '';
      let daysOverdue = Number(m.daysOverdue ?? m.days_overdue ?? 0);
      if (!daysOverdue && nextDate) {
        const diff = Math.floor((Date.now() - new Date(nextDate).getTime()) / (1000 * 60 * 60 * 24));
        daysOverdue = diff > 0 ? diff : 0;
      }
      return {
        vehicleId: Number(m.vehicleId ?? m.VEHICLE_ID ?? m.vehicle_id ?? 0),
        vehicleRegistration: String(m.vehicleRegistration ?? m.REGISTRATION_NUMBER ?? m.registration_number ?? `Vehicle #${m.vehicleId ?? m.VEHICLE_ID}`),
        lastMaintenance: lastDate ? String(lastDate).split('T')[0] : 'N/A',
        nextMaintenance: nextDate ? String(nextDate).split('T')[0] : 'N/A',
        status: String(m.status ?? m.STATUS ?? (daysOverdue > 0 ? 'OVERDUE' : 'SCHEDULED')),
        daysOverdue,
      };
    });
  },
  getTripPerformance: async (): Promise<TripPerformanceReport[]> => {
    const res = await apiClient.get('/reports/trip-performance');
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map((t: any) => {
      const cap = Number(t.capacity ?? t.CAPACITY ?? 45);
      const booked = Number(t.bookedSeats ?? t.BOOKED_SEATS ?? t.booked_seats ?? 0);
      const avail = Number(t.availableSeats ?? t.AVAILABLE_SEATS ?? Math.max(0, cap - booked));
      const occ = Number(t.occupancyPercent ?? t.OCC_RATE ?? t.occ_rate ?? (cap > 0 ? (booked / cap) * 100 : 0));
      const rev = Number(t.revenue ?? t.GENERATED_REVENUE ?? t.generated_revenue ?? 0);
      return {
        tripId: Number(t.tripId ?? t.TRIP_ID ?? t.trip_id ?? 0),
        route: String(t.route ?? t.ROUTE_NAME ?? t.route_name ?? 'N/A'),
        vehicle: String(t.vehicle ?? t.REGISTRATION_NUMBER ?? t.registration_number ?? 'Fleet Bus'),
        capacity: cap,
        bookedSeats: booked,
        availableSeats: avail,
        occupancyPercent: occ,
        revenue: rev,
      };
    });
  },
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get('/reports/dashboard');
    const d = res.data || {};
    return {
      totalVehicles: Number(d.totalVehicles ?? d.TOTAL_VEHICLES ?? 0),
      activeDrivers: Number(d.activeDrivers ?? d.ACTIVE_DRIVERS ?? 0),
      todaysTrips: Number(d.todaysTrips ?? d.TODAYS_TRIPS ?? 0),
      todaysBookings: Number(d.todaysBookings ?? d.TODAYS_BOOKINGS ?? 0),
      todaysRevenue: Number(d.todaysRevenue ?? d.TODAYS_REVENUE ?? 0),
      maintenanceDue: Number(d.maintenanceDue ?? d.MAINTENANCE_DUE ?? 0),
    };
  },
};

export default reportService;
