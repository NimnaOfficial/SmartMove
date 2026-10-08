import os

base_path = r"C:\Users\SANDANIMNE\Desktop\code ss\SmartMove\SmartMove\frontend\smartmove-web\src\services"
os.makedirs(base_path, exist_ok=True)

files = {
    "authService.ts": """import apiClient from '@/api/client';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('smartmove_token');
    localStorage.removeItem('smartmove_user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('smartmove_user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('smartmove_token'),
  getToken: () => localStorage.getItem('smartmove_token'),
};
export default authService;
""",
    "vehicleService.ts": """import apiClient from '@/api/client';
import { Vehicle, VehicleFormData } from '@/types';

const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const res = await apiClient.get('/vehicles');
    return res.data;
  },
  getById: async (id: number): Promise<Vehicle> => {
    const res = await apiClient.get(`/vehicles/${id}`);
    return res.data;
  },
  create: async (data: VehicleFormData): Promise<Vehicle> => {
    const res = await apiClient.post('/vehicles', data);
    return res.data;
  },
  update: async (id: number, data: VehicleFormData): Promise<Vehicle> => {
    const res = await apiClient.put(`/vehicles/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },
  search: async (query: string): Promise<Vehicle[]> => {
    const res = await apiClient.get(`/vehicles/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default vehicleService;
""",
    "driverService.ts": """import apiClient from '@/api/client';
import { Driver, DriverFormData } from '@/types';

const driverService = {
  getAll: async (): Promise<Driver[]> => {
    const res = await apiClient.get('/drivers');
    return res.data;
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
  getProfile: async (): Promise<Driver> => {
    const res = await apiClient.get('/drivers/profile');
    return res.data;
  },
  updateProfile: async (data: Partial<DriverFormData>): Promise<Driver> => {
    const res = await apiClient.put('/drivers/profile', data);
    return res.data;
  },
  getMyTrips: async (): Promise<any[]> => {
    const res = await apiClient.get('/drivers/my-trips');
    return res.data;
  },
  search: async (query: string): Promise<Driver[]> => {
    const res = await apiClient.get(`/drivers/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default driverService;
""",
    "routeService.ts": """import apiClient from '@/api/client';
import { RouteInfo, RouteFormData } from '@/types';

const routeService = {
  getAll: async (): Promise<RouteInfo[]> => {
    const res = await apiClient.get('/routes');
    return res.data;
  },
  getById: async (id: number): Promise<RouteInfo> => {
    const res = await apiClient.get(`/routes/${id}`);
    return res.data;
  },
  create: async (data: RouteFormData): Promise<RouteInfo> => {
    const res = await apiClient.post('/routes', data);
    return res.data;
  },
  update: async (id: number, data: RouteFormData): Promise<RouteInfo> => {
    const res = await apiClient.put(`/routes/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/routes/${id}`);
  },
  search: async (query: string): Promise<RouteInfo[]> => {
    const res = await apiClient.get(`/routes/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default routeService;
""",
    "passengerService.ts": """import apiClient from '@/api/client';
import { Passenger, PassengerFormData } from '@/types';

const passengerService = {
  getAll: async (): Promise<Passenger[]> => {
    const res = await apiClient.get('/passengers');
    return res.data;
  },
  getById: async (id: number): Promise<Passenger> => {
    const res = await apiClient.get(`/passengers/${id}`);
    return res.data;
  },
  update: async (id: number, data: PassengerFormData): Promise<Passenger> => {
    const res = await apiClient.put(`/passengers/${id}`, data);
    return res.data;
  },
  getProfile: async (): Promise<Passenger> => {
    const res = await apiClient.get('/passengers/profile');
    return res.data;
  },
  updateProfile: async (data: Partial<PassengerFormData>): Promise<Passenger> => {
    const res = await apiClient.put('/passengers/profile', data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/passengers/${id}`);
  },
  search: async (query: string): Promise<Passenger[]> => {
    const res = await apiClient.get(`/passengers/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default passengerService;
""",
    "tripService.ts": """import apiClient from '@/api/client';
import { Trip, TripFormData } from '@/types';

const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const res = await apiClient.get('/trips');
    return res.data;
  },
  getById: async (id: number): Promise<Trip> => {
    const res = await apiClient.get(`/trips/${id}`);
    return res.data;
  },
  create: async (data: TripFormData): Promise<Trip> => {
    const res = await apiClient.post('/trips', data);
    return res.data;
  },
  update: async (id: number, data: Partial<TripFormData>): Promise<Trip> => {
    const res = await apiClient.put(`/trips/${id}`, data);
    return res.data;
  },
  updateStatus: async (id: number, status: string): Promise<Trip> => {
    const res = await apiClient.patch(`/trips/${id}/status`, { status });
    return res.data;
  },
  search: async (params: { origin?: string; destination?: string; date?: string; maxPrice?: number }): Promise<Trip[]> => {
    const res = await apiClient.get('/trips/search', { params });
    return res.data;
  },
  getUpcoming: async (): Promise<Trip[]> => {
    const res = await apiClient.get('/trips/upcoming');
    return res.data;
  },
};
export default tripService;
""",
    "bookingService.ts": """import apiClient from '@/api/client';
import { Booking, BookingFormData } from '@/types';

const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const res = await apiClient.get('/bookings');
    return res.data;
  },
  getById: async (id: number): Promise<Booking> => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
  },
  create: async (data: BookingFormData): Promise<Booking> => {
    const res = await apiClient.post('/bookings', data);
    return res.data;
  },
  cancel: async (id: number): Promise<Booking> => {
    const res = await apiClient.put(`/bookings/${id}/cancel`);
    return res.data;
  },
  getMyBookings: async (): Promise<Booking[]> => {
    const res = await apiClient.get('/bookings/my-bookings');
    return res.data;
  },
  search: async (query: string): Promise<Booking[]> => {
    const res = await apiClient.get(`/bookings/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default bookingService;
""",
    "paymentService.ts": """import apiClient from '@/api/client';
import { Payment, PaymentFormData } from '@/types';

const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    const res = await apiClient.get('/payments');
    return res.data;
  },
  getById: async (id: number): Promise<Payment> => {
    const res = await apiClient.get(`/payments/${id}`);
    return res.data;
  },
  processPayment: async (data: PaymentFormData): Promise<Payment> => {
    const res = await apiClient.post('/payments', data);
    return res.data;
  },
  getByBooking: async (bookingId: number): Promise<Payment> => {
    const res = await apiClient.get(`/payments/booking/${bookingId}`);
    return res.data;
  },
};
export default paymentService;
""",
    "maintenanceService.ts": """import apiClient from '@/api/client';
import { Maintenance, MaintenanceFormData } from '@/types';

const maintenanceService = {
  getAll: async (): Promise<Maintenance[]> => {
    const res = await apiClient.get('/maintenance');
    return res.data;
  },
  getById: async (id: number): Promise<Maintenance> => {
    const res = await apiClient.get(`/maintenance/${id}`);
    return res.data;
  },
  create: async (data: MaintenanceFormData): Promise<Maintenance> => {
    const res = await apiClient.post('/maintenance', data);
    return res.data;
  },
  update: async (id: number, data: MaintenanceFormData): Promise<Maintenance> => {
    const res = await apiClient.put(`/maintenance/${id}`, data);
    return res.data;
  },
  getDueVehicles: async (): Promise<Maintenance[]> => {
    const res = await apiClient.get('/maintenance/due');
    return res.data;
  },
  search: async (query: string): Promise<Maintenance[]> => {
    const res = await apiClient.get(`/maintenance/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default maintenanceService;
""",
    "feedbackService.ts": """import apiClient from '@/api/client';
import { Feedback, FeedbackFormData } from '@/types';

const feedbackService = {
  getAll: async (): Promise<Feedback[]> => {
    const res = await apiClient.get('/feedback');
    return res.data;
  },
  getById: async (id: number): Promise<Feedback> => {
    const res = await apiClient.get(`/feedback/${id}`);
    return res.data;
  },
  submit: async (data: FeedbackFormData): Promise<Feedback> => {
    const res = await apiClient.post('/feedback', data);
    return res.data;
  },
  getByPassenger: async (passengerId: number): Promise<Feedback[]> => {
    const res = await apiClient.get(`/feedback/passenger/${passengerId}`);
    return res.data;
  },
  search: async (query: string): Promise<Feedback[]> => {
    const res = await apiClient.get(`/feedback/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};
export default feedbackService;
""",
    "reportService.ts": """import apiClient from '@/api/client';
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
""",
    "contentService.ts": """import apiClient from '@/api/client';
import { Review, Announcement, AnnouncementFormData, VehicleDocument, VehicleImage, TripMedia } from '@/types';

const contentService = {
  // ─── Reviews (MongoDB) ───────────────────────────────────
  getAllReviews: async (): Promise<Review[]> => {
    const res = await apiClient.get('/reviews');
    return res.data;
  },
  getReviewsByRoute: async (routeId: number): Promise<Review[]> => {
    const res = await apiClient.get(`/reviews/route/${routeId}`);
    return res.data;
  },
  getTopRated: async (): Promise<any> => {
    const res = await apiClient.get('/reviews/top-rated');
    return res.data;
  },
  searchReviews: async (keyword: string): Promise<Review[]> => {
    const res = await apiClient.get(`/reviews/search?keyword=${encodeURIComponent(keyword)}`);
    return res.data;
  },
  submitReview: async (data: Partial<Review>): Promise<Review> => {
    const res = await apiClient.post('/reviews', data);
    return res.data;
  },

  // ─── Announcements (MongoDB) ─────────────────────────────
  getAllAnnouncements: async (): Promise<Announcement[]> => {
    const res = await apiClient.get('/announcements');
    return res.data;
  },
  createAnnouncement: async (data: AnnouncementFormData): Promise<Announcement> => {
    const res = await apiClient.post('/announcements', data);
    return res.data;
  },
  updateAnnouncement: async (id: string, data: AnnouncementFormData): Promise<Announcement> => {
    const res = await apiClient.put(`/announcements/${id}`, data);
    return res.data;
  },
  deleteAnnouncement: async (id: string): Promise<void> => {
    await apiClient.delete(`/announcements/${id}`);
  },

  // ─── Vehicle Documents (MongoDB) ─────────────────────────
  getVehicleDocuments: async (vehicleId: number): Promise<VehicleDocument[]> => {
    const res = await apiClient.get(`/documents/vehicle/${vehicleId}`);
    return res.data;
  },
  getVehicleImages: async (vehicleId: number): Promise<VehicleImage[]> => {
    const res = await apiClient.get(`/documents/vehicle/${vehicleId}/images`);
    return res.data;
  },
  uploadDocument: async (vehicleId: number, formData: FormData): Promise<VehicleDocument> => {
    const res = await apiClient.post(`/documents/vehicle/${vehicleId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  // ─── Trip Media (MongoDB) ────────────────────────────────
  getTripMedia: async (tripId: number): Promise<TripMedia[]> => {
    const res = await apiClient.get(`/media/trip/${tripId}`);
    return res.data;
  },
  getAllMedia: async (): Promise<TripMedia[]> => {
    const res = await apiClient.get('/media');
    return res.data;
  },
  uploadMedia: async (formData: FormData): Promise<TripMedia> => {
    const res = await apiClient.post('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteMedia: async (id: string): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },
};
export default contentService;
""",
    "index.ts": """export { default as authService } from './authService';
export { default as vehicleService } from './vehicleService';
export { default as driverService } from './driverService';
export { default as routeService } from './routeService';
export { default as passengerService } from './passengerService';
export { default as tripService } from './tripService';
export { default as bookingService } from './bookingService';
export { default as paymentService } from './paymentService';
export { default as maintenanceService } from './maintenanceService';
export { default as feedbackService } from './feedbackService';
export { default as reportService } from './reportService';
export { default as contentService } from './contentService';
"""
}

for filename, content in files.items():
    with open(os.path.join(base_path, filename), 'w', encoding='utf-8') as f:
        f.write(content)

print("Created 13 service files successfully!")
