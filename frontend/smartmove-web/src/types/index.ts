// ============================================================
// SmartMove Transport Solutions — TypeScript Type Definitions
// Matches Oracle (relational) + MongoDB (dynamic) schemas
// ============================================================

// ─── Auth ────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'ADMIN' | 'DRIVER' | 'PASSENGER';
}

export interface AuthResponse {
  token: string;
  role: 'ADMIN' | 'DRIVER' | 'PASSENGER';
  userId: number;
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mustChangePassword?: boolean;
}

// ─── Vehicle (Oracle) ────────────────────────────────────────
export interface Vehicle {
  vehicleId: number;
  registrationNumber: string;
  type: string;
  model: string;
  year: number;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RETIRED';
  description?: string;
  driverId?: number;
  driverName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleFormData {
  registrationNumber: string;
  type: string;
  model: string;
  year: number;
  capacity: number;
  status: string;
  description?: string;
  driverId?: number;
}

// ─── Driver (Oracle) ─────────────────────────────────────────
export interface Driver {
  driverId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_TRIP' | 'ON_LEAVE';
  rating?: number;
  totalTrips?: number;
  vehicleId?: number;
  vehicleRegistration?: string;
  password?: string;
  tempPassword?: string;
  mustChangePassword?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: string;
}

// ─── Route (Oracle) ──────────────────────────────────────────
export interface RouteInfo {
  routeId: number;
  origin: string;
  destination: string;
  distance?: number;
  distanceKm?: number;
  duration?: string;
  estimatedDuration?: string;
  baseFare?: number;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  tripCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RouteFormData {
  origin: string;
  destination: string;
  distance?: number;
  distanceKm?: number;
  duration?: string;
  estimatedDuration?: string;
  baseFare?: number;
  description?: string;
  status: string;
}

// ─── Passenger (Oracle) ──────────────────────────────────────
export interface Passenger {
  passengerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  totalBookings?: number;
  registeredAt?: string;
  updatedAt?: string;
  address?: string;
  city?: string;
}

export interface PassengerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
}

// ─── Trip (Oracle) ───────────────────────────────────────────
export interface Trip {
  tripId: number;
  routeId: number;
  routeOrigin?: string;
  routeDestination?: string;
  vehicleId: number;
  vehicleRegistration?: string;
  driverId: number;
  driverName?: string;
  departureDate?: string;
  departureTime: string;
  arrivalTime?: string;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  fare: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalSeats?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TripFormData {
  routeId: number;
  vehicleId: number;
  driverId: number;
  departureDate?: string;
  departureTime: string;
  arrivalTime?: string;
  availableSeats?: number;
  fare?: number;
  status?: string;
}

// ─── Booking (Oracle) ────────────────────────────────────────
export interface Booking {
  bookingId: number;
  passengerId: number;
  passengerName?: string;
  tripId: number;
  routeOrigin?: string;
  routeDestination?: string;
  departureDate?: string;
  departureTime?: string;
  ticketQuantity?: number;
  seatsBooked?: number;
  totalAmount?: number;
  totalFare?: number;
  amount?: number;
  status?: string;
  bookingStatus?: 'CONFIRMED' | 'CANCELLED' | 'PENDING' | 'COMPLETED' | string;
  paymentStatus?: 'PAID' | 'UNPAID' | 'REFUNDED' | string;
  bookingDate?: string;
  createdAt?: string;
  updatedAt?: string;
  seatNumber?: string;
}

export interface BookingFormData {
  passengerId: number;
  tripId: number;
  ticketQuantity: number;
}

// ─── Payment (Oracle) ────────────────────────────────────────
export interface Payment {
  paymentId: number;
  bookingId: number;
  passengerId?: number;
  passengerName?: string;
  amount: number;
  paymentMethod: 'CARD' | 'CASH' | 'BANK_TRANSFER' | 'MOBILE';
  paymentDate: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
  transactionRef?: string;
  createdAt?: string;
}

export interface PaymentFormData {
  bookingId: number;
  paymentMethod: string;
  amount: number;
}

// ─── Maintenance (Oracle) ────────────────────────────────────
export interface Maintenance {
  maintenanceId: number;
  vehicleId: number;
  vehicleRegistration?: string;
  maintenanceDate: string;
  nextMaintenanceDate?: string;
  type: 'ROUTINE' | 'REPAIR' | 'INSPECTION' | 'EMERGENCY';
  description: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  cost?: number;
  technician?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceFormData {
  vehicleId: number;
  maintenanceDate: string;
  nextMaintenanceDate?: string;
  type: string;
  description: string;
  status: string;
  cost?: number;
  technician?: string;
}

// ─── Feedback (Oracle) ───────────────────────────────────────
export interface Feedback {
  feedbackId: number;
  passengerId: number;
  passengerName?: string;
  routeId?: number;
  routeName?: string;
  vehicleId?: number;
  driverId?: number;
  rating?: number;
  comment?: string;
  description?: string;
  status?: string;
  type: 'REVIEW' | 'COMPLAINT' | 'SUGGESTION' | 'APPRECIATION' | string;
  createdAt?: string;
}

export interface FeedbackFormData {
  passengerId: number;
  routeId?: number;
  vehicleId?: number;
  driverId?: number;
  rating: number;
  comment: string;
  type: string;
}

// ─── MongoDB Content: Reviews ────────────────────────────────
export interface Review {
  _id?: string;
  routeId: number;
  vehicleId?: number;
  driverId?: number;
  passengerId: number;
  passengerName?: string;
  rating: number;
  comment: string;
  type: 'REVIEW' | 'COMPLAINT';
  tags?: string[];
  createdAt?: string;
}

// ─── MongoDB Content: Announcements ──────────────────────────
export interface Announcement {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  publishedAt?: string;
  category?: string;
  targetAudience?: 'ALL' | 'PASSENGERS' | 'DRIVERS' | 'ADMIN' | string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  status?: 'ACTIVE' | 'ARCHIVED' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnouncementFormData {
  title: string;
  message: string;
  targetAudience: string;
  priority: string;
}

// ─── MongoDB Content: Vehicle Documents ──────────────────────
export interface VehicleDocument {
  _id?: string;
  vehicleId: number;
  documentType: string;
  fileName: string;
  url: string;
  uploadedAt?: string;
  status: 'VALID' | 'EXPIRED' | 'PENDING';
}

export interface VehicleImage {
  _id?: string;
  vehicleId: number;
  url: string;
  caption?: string;
  uploadedAt?: string;
}

// ─── MongoDB Content: Trip Media ─────────────────────────────
export interface TripMedia {
  _id?: string;
  tripId: number;
  routeId?: number;
  mediaType: 'IMAGE' | 'VIDEO';
  url: string;
  caption?: string;
  uploadedAt?: string;
}

// ─── Reports ─────────────────────────────────────────────────
export interface RouteUsageReport {
  routeId: number;
  origin: string;
  destination: string;
  bookingCount: number;
  rank: number;
}

export interface RevenueReport {
  totalRevenue: number;
  ticketsSold: number;
  averageTicketValue: number;
  periodStart: string;
  periodEnd: string;
  dailyBreakdown?: { date: string; revenue: number; tickets: number }[];
}

export interface PassengerHistoryReport {
  passengerId: number;
  passengerName: string;
  trips: {
    tripId: number;
    route: string;
    travelDate: string;
    vehicle: string;
    bookingId: number;
    paymentStatus: string;
  }[];
}

export interface MaintenanceDueReport {
  vehicleId: number;
  vehicleRegistration: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: string;
  daysOverdue?: number;
}

export interface TripPerformanceReport {
  tripId: number;
  route: string;
  vehicle: string;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  occupancyPercent: number;
  revenue: number;
}

// ─── Dashboard Stats ─────────────────────────────────────────
export interface DashboardStats {
  totalVehicles: number;
  activeDrivers: number;
  todaysTrips: number;
  todaysBookings: number;
  todaysRevenue: number;
  maintenanceDue: number;
}

// ─── Common API Response ─────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

