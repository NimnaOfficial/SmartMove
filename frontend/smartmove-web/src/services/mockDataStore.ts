import { 
  Vehicle, Driver, RouteInfo, Trip, Booking, Maintenance, 
  Feedback, Announcement, Review, TripMedia, VehicleDocument,
  DashboardStats, RouteUsageReport, RevenueReport, MaintenanceDueReport, TripPerformanceReport
} from '@/types';

const STORAGE_KEYS = {
  VEHICLES: 'smartmove_vehicles',
  DRIVERS: 'smartmove_drivers',
  ROUTES: 'smartmove_routes',
  TRIPS: 'smartmove_trips',
  BOOKINGS: 'smartmove_bookings',
  MAINTENANCE: 'smartmove_maintenance',
  FEEDBACK: 'smartmove_feedback',
  ANNOUNCEMENTS: 'smartmove_announcements',
  REVIEWS: 'smartmove_reviews',
  MEDIA: 'smartmove_media',
  DOCUMENTS: 'smartmove_documents'
};

const initialVehicles: Vehicle[] = [
  {
    vehicleId: 101,
    registrationNumber: 'WP-ND-4521',
    type: 'Luxury Coach',
    model: 'Volvo 9900',
    year: 2024,
    capacity: 45,
    status: 'ACTIVE',
    description: 'Executive class coach with onboard Wi-Fi, AC, and reclining seats.',
    driverId: 201,
    driverName: 'Kamal Perera',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-10-10T12:00:00Z'
  },
  {
    vehicleId: 102,
    registrationNumber: 'CP-NB-7823',
    type: 'Standard',
    model: 'Ashok Leyland Viking',
    year: 2023,
    capacity: 54,
    status: 'ACTIVE',
    description: 'Intercity high-capacity passenger bus.',
    driverId: 202,
    driverName: 'Sunil Fernando',
    createdAt: '2026-02-10T09:30:00Z',
    updatedAt: '2026-10-08T15:20:00Z'
  },
  {
    vehicleId: 103,
    registrationNumber: 'SP-NC-1190',
    type: 'Mini Bus',
    model: 'Toyota Coaster',
    year: 2025,
    capacity: 28,
    status: 'MAINTENANCE',
    description: 'Coastal feeder shuttle bus scheduled for brake inspection.',
    driverId: 203,
    driverName: 'Nimal Silva',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-10-11T09:10:00Z'
  },
  {
    vehicleId: 104,
    registrationNumber: 'EP-NE-9941',
    type: 'Sleeper',
    model: 'Scania Touring HD',
    year: 2024,
    capacity: 36,
    status: 'ACTIVE',
    description: 'Long-haul overnight sleeper coach with air suspension.',
    driverId: 204,
    driverName: 'Chaminda Bandara',
    createdAt: '2026-04-12T14:40:00Z',
    updatedAt: '2026-10-09T18:00:00Z'
  },
  {
    vehicleId: 105,
    registrationNumber: 'WP-NA-3312',
    type: 'Standard',
    model: 'Isuzu Journey',
    year: 2021,
    capacity: 40,
    status: 'INACTIVE',
    description: 'Spare backup bus reserved for fleet overflow.',
    driverId: undefined,
    driverName: 'Unassigned',
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2026-09-15T08:30:00Z'
  }
];

const initialDrivers: Driver[] = [
  {
    driverId: 201,
    firstName: 'Kamal',
    lastName: 'Perera',
    email: 'kamal.perera@smartmove.lk',
    phone: '+94 77 123 4567',
    licenseNumber: 'B8291041',
    status: 'ACTIVE',
    rating: 4.9,
    totalTrips: 184,
    vehicleId: 101,
    vehicleRegistration: 'WP-ND-4521'
  },
  {
    driverId: 202,
    firstName: 'Sunil',
    lastName: 'Fernando',
    email: 'sunil.fernando@smartmove.lk',
    phone: '+94 71 892 3410',
    licenseNumber: 'B7719230',
    status: 'ON_TRIP',
    rating: 4.8,
    totalTrips: 210,
    vehicleId: 102,
    vehicleRegistration: 'CP-NB-7823'
  },
  {
    driverId: 203,
    firstName: 'Nimal',
    lastName: 'Silva',
    email: 'nimal.silva@smartmove.lk',
    phone: '+94 76 345 8891',
    licenseNumber: 'B6491823',
    status: 'ACTIVE',
    rating: 4.6,
    totalTrips: 142,
    vehicleId: 103,
    vehicleRegistration: 'SP-NC-1190'
  },
  {
    driverId: 204,
    firstName: 'Chaminda',
    lastName: 'Bandara',
    email: 'chaminda.bandara@smartmove.lk',
    phone: '+94 70 551 2289',
    licenseNumber: 'B9102481',
    status: 'ACTIVE',
    rating: 4.9,
    totalTrips: 98,
    vehicleId: 104,
    vehicleRegistration: 'EP-NE-9941'
  },
  {
    driverId: 205,
    firstName: 'Ruwan',
    lastName: 'Jayawardena',
    email: 'ruwan.j@smartmove.lk',
    phone: '+94 72 443 1928',
    licenseNumber: 'B5521903',
    status: 'ON_LEAVE',
    rating: 4.3,
    totalTrips: 76
  }
];

const initialRoutes: RouteInfo[] = [
  {
    routeId: 301,
    origin: 'Colombo Fort',
    destination: 'Kandy Central',
    distance: 115,
    duration: '3h 15m',
    description: 'Central expressway and A1 highway corridor connecting the commercial and hill capitals.',
    status: 'ACTIVE',
    tripCount: 42
  },
  {
    routeId: 302,
    origin: 'Colombo Makumbura',
    destination: 'Galle Bus Stand',
    distance: 126,
    duration: '1h 45m',
    description: 'Southern Expressway high-speed transit line.',
    status: 'ACTIVE',
    tripCount: 38
  },
  {
    routeId: 303,
    origin: 'Colombo Fort',
    destination: 'Jaffna Town',
    distance: 395,
    duration: '7h 30m',
    description: 'Northern trunk express route with night luxury sleeper options.',
    status: 'ACTIVE',
    tripCount: 18
  },
  {
    routeId: 304,
    origin: 'Kandy Central',
    destination: 'Nuwara Eliya',
    distance: 76,
    duration: '2h 45m',
    description: 'Scenic hill country tourist and commuter route.',
    status: 'ACTIVE',
    tripCount: 15
  },
  {
    routeId: 305,
    origin: 'Colombo Pettah',
    destination: 'Katunayake Airport',
    distance: 34,
    duration: '0h 40m',
    description: 'Airport expressway non-stop shuttle.',
    status: 'ACTIVE',
    tripCount: 64
  }
];

const initialTrips: Trip[] = [
  {
    tripId: 401,
    routeId: 301,
    routeOrigin: 'Colombo Fort',
    routeDestination: 'Kandy Central',
    vehicleId: 101,
    vehicleRegistration: 'WP-ND-4521',
    driverId: 201,
    driverName: 'Kamal Perera',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '07:30',
    capacity: 45,
    bookedSeats: 38,
    availableSeats: 7,
    fare: 1250,
    status: 'IN_PROGRESS'
  },
  {
    tripId: 402,
    routeId: 302,
    routeOrigin: 'Colombo Makumbura',
    routeDestination: 'Galle Bus Stand',
    vehicleId: 102,
    vehicleRegistration: 'CP-NB-7823',
    driverId: 202,
    driverName: 'Sunil Fernando',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '10:00',
    capacity: 54,
    bookedSeats: 48,
    availableSeats: 6,
    fare: 950,
    status: 'SCHEDULED'
  },
  {
    tripId: 403,
    routeId: 303,
    routeOrigin: 'Colombo Fort',
    routeDestination: 'Jaffna Town',
    vehicleId: 104,
    vehicleRegistration: 'EP-NE-9941',
    driverId: 204,
    driverName: 'Chaminda Bandara',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '21:00',
    capacity: 36,
    bookedSeats: 32,
    availableSeats: 4,
    fare: 3200,
    status: 'SCHEDULED'
  },
  {
    tripId: 404,
    routeId: 305,
    routeOrigin: 'Colombo Pettah',
    routeDestination: 'Katunayake Airport',
    vehicleId: 101,
    vehicleRegistration: 'WP-ND-4521',
    driverId: 201,
    driverName: 'Kamal Perera',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '14:30',
    capacity: 45,
    bookedSeats: 42,
    availableSeats: 3,
    fare: 800,
    status: 'SCHEDULED'
  },
  {
    tripId: 405,
    routeId: 304,
    routeOrigin: 'Kandy Central',
    routeDestination: 'Nuwara Eliya',
    vehicleId: 103,
    vehicleRegistration: 'SP-NC-1190',
    driverId: 203,
    driverName: 'Nimal Silva',
    departureDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    departureTime: '08:15',
    capacity: 28,
    bookedSeats: 26,
    availableSeats: 2,
    fare: 1100,
    status: 'COMPLETED'
  }
];

const initialBookings: Booking[] = [
  {
    bookingId: 501,
    passengerId: 1,
    passengerName: 'Anura Wickramasinghe',
    tripId: 401,
    routeOrigin: 'Colombo Fort',
    routeDestination: 'Kandy Central',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '07:30',
    ticketQuantity: 2,
    totalAmount: 2500,
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString()
  },
  {
    bookingId: 502,
    passengerId: 2,
    passengerName: 'Dilini Samarasekara',
    tripId: 402,
    routeOrigin: 'Colombo Makumbura',
    routeDestination: 'Galle Bus Stand',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '10:00',
    ticketQuantity: 1,
    totalAmount: 950,
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString()
  },
  {
    bookingId: 503,
    passengerId: 3,
    passengerName: 'Thilina Senanayake',
    tripId: 403,
    routeOrigin: 'Colombo Fort',
    routeDestination: 'Jaffna Town',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '21:00',
    ticketQuantity: 2,
    totalAmount: 6400,
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString()
  },
  {
    bookingId: 504,
    passengerId: 4,
    passengerName: 'Kavindu Gunawardena',
    tripId: 404,
    routeOrigin: 'Colombo Pettah',
    routeDestination: 'Katunayake Airport',
    departureDate: new Date().toISOString().split('T')[0],
    departureTime: '14:30',
    ticketQuantity: 3,
    totalAmount: 2400,
    bookingStatus: 'PENDING',
    paymentStatus: 'UNPAID',
    createdAt: new Date().toISOString()
  },
  {
    bookingId: 505,
    passengerId: 5,
    passengerName: 'Sanduni Jayasinghe',
    tripId: 405,
    routeOrigin: 'Kandy Central',
    routeDestination: 'Nuwara Eliya',
    departureDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    departureTime: '08:15',
    ticketQuantity: 1,
    totalAmount: 1100,
    bookingStatus: 'COMPLETED',
    paymentStatus: 'PAID',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const initialMaintenance: Maintenance[] = [
  {
    maintenanceId: 601,
    vehicleId: 103,
    vehicleRegistration: 'SP-NC-1190',
    maintenanceDate: new Date().toISOString().split('T')[0],
    nextMaintenanceDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    type: 'REPAIR',
    description: 'Hydraulic brake fluid replacement and rotor pad refurbishment.',
    status: 'IN_PROGRESS',
    cost: 45000,
    technician: 'Lanka AutoCare Workshop',
    createdAt: new Date().toISOString()
  },
  {
    maintenanceId: 602,
    vehicleId: 102,
    vehicleRegistration: 'CP-NB-7823',
    maintenanceDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    nextMaintenanceDate: new Date().toISOString().split('T')[0],
    type: 'ROUTINE',
    description: 'Scheduled 15,000 km engine oil, transmission fluid, and air filter renewal.',
    status: 'OVERDUE',
    cost: 32000,
    technician: 'Central Fleet Garage',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    maintenanceId: 603,
    vehicleId: 101,
    vehicleRegistration: 'WP-ND-4521',
    maintenanceDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    nextMaintenanceDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    type: 'INSPECTION',
    description: 'Annual safety fitness and passenger seatbelt tension validation.',
    status: 'SCHEDULED',
    cost: 18000,
    technician: 'Volvo Authorized Service Center',
    createdAt: new Date().toISOString()
  },
  {
    maintenanceId: 604,
    vehicleId: 104,
    vehicleRegistration: 'EP-NE-9941',
    maintenanceDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    nextMaintenanceDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    type: 'ROUTINE',
    description: 'Tire rotation, alignment, and AC coolant replenishment.',
    status: 'COMPLETED',
    cost: 62000,
    technician: 'Express Line Pitstop',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
  }
];

const initialFeedback: Feedback[] = [
  {
    feedbackId: 701,
    passengerId: 1,
    passengerName: 'Anura Wickramasinghe',
    routeId: 301,
    routeName: 'Colombo Fort → Kandy Central',
    vehicleId: 101,
    driverId: 201,
    rating: 5,
    comment: 'The Volvo bus was super smooth, punctual, and the driver drove very safely over the mountains.',
    type: 'REVIEW',
    createdAt: new Date().toISOString()
  },
  {
    feedbackId: 702,
    passengerId: 2,
    passengerName: 'Dilini Samarasekara',
    routeId: 302,
    routeName: 'Colombo Makumbura → Galle Bus Stand',
    vehicleId: 102,
    driverId: 202,
    rating: 4,
    comment: 'Great southern expressway journey! Arrived right on schedule.',
    type: 'REVIEW',
    createdAt: new Date().toISOString()
  },
  {
    feedbackId: 703,
    passengerId: 4,
    passengerName: 'Kavindu Gunawardena',
    routeId: 305,
    routeName: 'Colombo Pettah → Katunayake Airport',
    vehicleId: 101,
    driverId: 201,
    rating: 2,
    comment: 'Boarding gate was slightly delayed by 10 minutes at Pettah.',
    type: 'COMPLAINT',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    feedbackId: 704,
    passengerId: 5,
    passengerName: 'Sanduni Jayasinghe',
    routeId: 304,
    routeName: 'Kandy Central → Nuwara Eliya',
    vehicleId: 103,
    driverId: 203,
    rating: 5,
    comment: 'Breathtaking scenery and friendly driver. Would definitely book again!',
    type: 'REVIEW',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

const initialAnnouncements: Announcement[] = [
  {
    _id: 'ann_01',
    title: 'New High-Speed Expressway Fleet Launched',
    message: 'We have added brand new Volvo 9900 coaches to our Southern Expressway routes starting this week.',
    publishedAt: new Date().toISOString(),
    targetAudience: 'ALL',
    priority: 'HIGH',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ann_02',
    title: 'Scheduled System Maintenance Window',
    message: 'Online booking payments will undergo brief maintenance on Sunday from 02:00 AM to 03:30 AM.',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    targetAudience: 'PASSENGERS',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'ann_03',
    title: 'Driver Safety & Defensive Driving Workshop',
    message: 'Mandatory quarterly safety refresher for all Southern and Central route captains on Friday.',
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    targetAudience: 'DRIVERS',
    priority: 'HIGH',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

const initialReviews: Review[] = [
  {
    _id: 'rev_01',
    routeId: 301,
    vehicleId: 101,
    driverId: 201,
    passengerId: 1,
    passengerName: 'Anura Wickramasinghe',
    rating: 5,
    comment: 'Exceptional journey quality, spotless interior and courteous driver.',
    type: 'REVIEW',
    tags: ['punctual', 'clean', 'polite'],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'rev_02',
    routeId: 302,
    vehicleId: 102,
    driverId: 202,
    passengerId: 2,
    passengerName: 'Dilini Samarasekara',
    rating: 4,
    comment: 'Comfortable ride and good AC cooling throughout the trip.',
    type: 'REVIEW',
    tags: ['air-conditioned', 'fast'],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'rev_03',
    routeId: 305,
    vehicleId: 101,
    driverId: 201,
    passengerId: 4,
    passengerName: 'Kavindu Gunawardena',
    rating: 2,
    comment: 'Bus departed 10 minutes late from Pettah terminal due to luggage delays.',
    type: 'COMPLAINT',
    tags: ['delay', 'luggage'],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const initialMedia: TripMedia[] = [
  {
    _id: 'med_01',
    tripId: 401,
    routeId: 301,
    mediaType: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
    caption: 'Luxury Coach at Kandy Terminal Departure',
    uploadedAt: new Date().toISOString()
  },
  {
    _id: 'med_02',
    tripId: 402,
    routeId: 302,
    mediaType: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop',
    caption: 'Southern Expressway Cruiser En Route',
    uploadedAt: new Date().toISOString()
  }
];

const initialDocuments: VehicleDocument[] = [
  {
    _id: 'doc_01',
    vehicleId: 101,
    documentType: 'Revenue License',
    fileName: 'WP-ND-4521-RevenueLicense-2026.pdf',
    url: 'https://example.com/docs/wp-nd-4521-license.pdf',
    status: 'VALID',
    uploadedAt: new Date().toISOString()
  },
  {
    _id: 'doc_02',
    vehicleId: 101,
    documentType: 'Comprehensive Insurance',
    fileName: 'WP-ND-4521-SLIC-Insurance-Policy.pdf',
    url: 'https://example.com/docs/wp-nd-4521-insurance.pdf',
    status: 'VALID',
    uploadedAt: new Date().toISOString()
  }
];

function getStore<T>(key: string, defaults: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return defaults;
  }
}

function setStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to set localStorage', e);
  }
}

export const mockStore = {
  // Vehicles
  getVehicles(): Vehicle[] {
    return getStore<Vehicle>(STORAGE_KEYS.VEHICLES, initialVehicles);
  },
  saveVehicle(data: any): Vehicle {
    const list = this.getVehicles();
    if (data.vehicleId) {
      const idx = list.findIndex(v => v.vehicleId === data.vehicleId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() } as Vehicle;
        setStore(STORAGE_KEYS.VEHICLES, list);
        return list[idx];
      }
    }
    const newId = list.length > 0 ? Math.max(...list.map(v => v.vehicleId || 0)) + 1 : 101;
    const newVehicle: Vehicle = {
      vehicleId: newId,
      registrationNumber: data.registrationNumber || 'WP-NEW-' + newId,
      type: data.type || 'Standard',
      model: data.model || 'Standard Coach',
      year: data.year || new Date().getFullYear(),
      capacity: data.capacity || 45,
      status: (data.status as any) || 'ACTIVE',
      driverId: data.driverId,
      driverName: data.driverName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newVehicle);
    setStore(STORAGE_KEYS.VEHICLES, list);
    return newVehicle;
  },
  deleteVehicle(id: number): void {
    const list = this.getVehicles().filter(v => v.vehicleId !== id);
    setStore(STORAGE_KEYS.VEHICLES, list);
  },

  // Drivers
  getDrivers(): Driver[] {
    return getStore<Driver>(STORAGE_KEYS.DRIVERS, initialDrivers);
  },
  saveDriver(data: any): Driver {
    const list = this.getDrivers();
    if (data.driverId) {
      const idx = list.findIndex(d => d.driverId === data.driverId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() } as Driver;
        setStore(STORAGE_KEYS.DRIVERS, list);
        return list[idx];
      }
    }
    const newId = list.length > 0 ? Math.max(...list.map(d => d.driverId || 0)) + 1 : 201;
    const newDriver: Driver = {
      driverId: newId,
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'Driver',
      email: data.email || `driver${newId}@smartmove.lk`,
      phone: data.phone || '+94 77 000 0000',
      licenseNumber: data.licenseNumber || 'B' + Math.floor(1000000 + Math.random() * 9000000),
      status: (data.status as any) || 'ACTIVE',
      rating: 5.0,
      totalTrips: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newDriver);
    setStore(STORAGE_KEYS.DRIVERS, list);
    return newDriver;
  },
  deleteDriver(id: number): void {
    const list = this.getDrivers().filter(d => d.driverId !== id);
    setStore(STORAGE_KEYS.DRIVERS, list);
  },

  // Routes
  getRoutes(): RouteInfo[] {
    return getStore<RouteInfo>(STORAGE_KEYS.ROUTES, initialRoutes);
  },
  saveRoute(data: any): RouteInfo {
    const list = this.getRoutes();
    if (data.routeId) {
      const idx = list.findIndex(r => r.routeId === data.routeId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() } as RouteInfo;
        setStore(STORAGE_KEYS.ROUTES, list);
        return list[idx];
      }
    }
    const newId = list.length > 0 ? Math.max(...list.map(r => r.routeId || 0)) + 1 : 301;
    const newRoute: RouteInfo = {
      routeId: newId,
      origin: data.origin || 'City A',
      destination: data.destination || 'City B',
      distance: data.distance || 100,
      duration: data.duration || '2h 0m',
      description: data.description || '',
      status: (data.status as any) || 'ACTIVE',
      tripCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newRoute);
    setStore(STORAGE_KEYS.ROUTES, list);
    return newRoute;
  },
  deleteRoute(id: number): void {
    const list = this.getRoutes().filter(r => r.routeId !== id);
    setStore(STORAGE_KEYS.ROUTES, list);
  },

  // Trips
  getTrips(): Trip[] {
    return getStore<Trip>(STORAGE_KEYS.TRIPS, initialTrips);
  },
  saveTrip(data: any): Trip {
    const list = this.getTrips();
    const routes = this.getRoutes();
    const vehicles = this.getVehicles();
    const drivers = this.getDrivers();

    const route = routes.find(r => r.routeId === data.routeId);
    const vehicle = vehicles.find(v => v.vehicleId === data.vehicleId);
    const driver = drivers.find(d => d.driverId === data.driverId);

    if (data.tripId) {
      const idx = list.findIndex(t => t.tripId === data.tripId);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...data,
          routeOrigin: route ? route.origin : list[idx].routeOrigin,
          routeDestination: route ? route.destination : list[idx].routeDestination,
          vehicleRegistration: vehicle ? vehicle.registrationNumber : list[idx].vehicleRegistration,
          driverName: driver ? `${driver.firstName} ${driver.lastName}` : list[idx].driverName,
          capacity: vehicle ? vehicle.capacity : list[idx].capacity,
          updatedAt: new Date().toISOString()
        } as Trip;
        setStore(STORAGE_KEYS.TRIPS, list);
        return list[idx];
      }
    }

    const newId = list.length > 0 ? Math.max(...list.map(t => t.tripId || 0)) + 1 : 401;
    const capacity = vehicle ? vehicle.capacity : 45;
    const newTrip: Trip = {
      tripId: newId,
      routeId: data.routeId || (routes[0]?.routeId || 301),
      routeOrigin: route ? route.origin : 'Colombo',
      routeDestination: route ? route.destination : 'Kandy',
      vehicleId: data.vehicleId || (vehicles[0]?.vehicleId || 101),
      vehicleRegistration: vehicle ? vehicle.registrationNumber : 'WP-ND-4521',
      driverId: data.driverId || (drivers[0]?.driverId || 201),
      driverName: driver ? `${driver.firstName} ${driver.lastName}` : 'Kamal Perera',
      departureDate: data.departureDate || new Date().toISOString().split('T')[0],
      departureTime: data.departureTime || '08:00',
      capacity,
      bookedSeats: 0,
      availableSeats: capacity,
      fare: data.fare || 1000,
      status: (data.status as any) || 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newTrip);
    setStore(STORAGE_KEYS.TRIPS, list);
    return newTrip;
  },
  deleteTrip(id: number): void {
    const list = this.getTrips().filter(t => t.tripId !== id);
    setStore(STORAGE_KEYS.TRIPS, list);
  },

  // Bookings
  getBookings(): Booking[] {
    return getStore<Booking>(STORAGE_KEYS.BOOKINGS, initialBookings);
  },
  cancelBooking(id: number): Booking {
    const list = this.getBookings();
    const idx = list.findIndex(b => b.bookingId === id);
    if (idx !== -1) {
      list[idx].bookingStatus = 'CANCELLED';
      list[idx].updatedAt = new Date().toISOString();
      setStore(STORAGE_KEYS.BOOKINGS, list);
      return list[idx];
    }
    throw new Error('Booking not found');
  },
  deleteBooking(id: number): void {
    const list = this.getBookings().filter(b => b.bookingId !== id);
    setStore(STORAGE_KEYS.BOOKINGS, list);
  },

  // Maintenance
  getMaintenance(): Maintenance[] {
    return getStore<Maintenance>(STORAGE_KEYS.MAINTENANCE, initialMaintenance);
  },
  saveMaintenance(data: any): Maintenance {
    const list = this.getMaintenance();
    const vehicles = this.getVehicles();
    const vehicle = vehicles.find(v => v.vehicleId === data.vehicleId);

    if (data.maintenanceId) {
      const idx = list.findIndex(m => m.maintenanceId === data.maintenanceId);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...data,
          vehicleRegistration: vehicle ? vehicle.registrationNumber : list[idx].vehicleRegistration,
          updatedAt: new Date().toISOString()
        } as Maintenance;
        setStore(STORAGE_KEYS.MAINTENANCE, list);
        return list[idx];
      }
    }

    const newId = list.length > 0 ? Math.max(...list.map(m => m.maintenanceId || 0)) + 1 : 601;
    const newRecord: Maintenance = {
      maintenanceId: newId,
      vehicleId: data.vehicleId || (vehicles[0]?.vehicleId || 101),
      vehicleRegistration: vehicle ? vehicle.registrationNumber : 'WP-ND-4521',
      maintenanceDate: data.maintenanceDate || new Date().toISOString().split('T')[0],
      nextMaintenanceDate: data.nextMaintenanceDate || '',
      type: (data.type as any) || 'ROUTINE',
      description: data.description || 'Routine vehicle inspection',
      status: (data.status as any) || 'SCHEDULED',
      cost: data.cost || 0,
      technician: data.technician || 'Central Fleet Garage',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newRecord);
    setStore(STORAGE_KEYS.MAINTENANCE, list);
    return newRecord;
  },
  deleteMaintenance(id: number): void {
    const list = this.getMaintenance().filter(m => m.maintenanceId !== id);
    setStore(STORAGE_KEYS.MAINTENANCE, list);
  },

  // Feedback
  getFeedback(): Feedback[] {
    return getStore<Feedback>(STORAGE_KEYS.FEEDBACK, initialFeedback);
  },
  deleteFeedback(id: number): void {
    const list = this.getFeedback().filter(f => f.feedbackId !== id);
    setStore(STORAGE_KEYS.FEEDBACK, list);
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    return getStore<Announcement>(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
  },
  saveAnnouncement(data: any): Announcement {
    const list = this.getAnnouncements();
    if (data._id) {
      const idx = list.findIndex(a => a._id === data._id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() } as Announcement;
        setStore(STORAGE_KEYS.ANNOUNCEMENTS, list);
        return list[idx];
      }
    }
    const newId = 'ann_' + Date.now().toString(36);
    const newAnn: Announcement = {
      _id: newId,
      title: data.title || 'New Announcement',
      message: data.message || '',
      publishedAt: new Date().toISOString(),
      targetAudience: (data.targetAudience as any) || 'ALL',
      priority: (data.priority as any) || 'MEDIUM',
      status: (data.status as any) || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newAnn);
    setStore(STORAGE_KEYS.ANNOUNCEMENTS, list);
    return newAnn;
  },
  deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements().filter(a => a._id !== id);
    setStore(STORAGE_KEYS.ANNOUNCEMENTS, list);
  },

  // Reviews
  getReviews(): Review[] {
    return getStore<Review>(STORAGE_KEYS.REVIEWS, initialReviews);
  },
  saveReview(data: any): Review {
    const list = this.getReviews();
    const newRev: Review = {
      _id: 'rev_' + Date.now().toString(36),
      routeId: data.routeId || 301,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      passengerId: data.passengerId || 1,
      passengerName: data.passengerName || 'Passenger',
      rating: data.rating || 5,
      comment: data.comment || '',
      type: data.type || 'REVIEW',
      tags: data.tags || ['service'],
      createdAt: new Date().toISOString()
    };
    list.unshift(newRev);
    setStore(STORAGE_KEYS.REVIEWS, list);
    return newRev;
  },

  // Media
  getMedia(): TripMedia[] {
    return getStore<TripMedia>(STORAGE_KEYS.MEDIA, initialMedia);
  },
  saveMedia(data: Partial<TripMedia>): TripMedia {
    const list = this.getMedia();
    const item: TripMedia = {
      _id: 'med_' + Date.now().toString(36),
      tripId: data.tripId || 401,
      routeId: data.routeId || 301,
      mediaType: data.mediaType || 'IMAGE',
      url: data.url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop',
      caption: data.caption || 'Trip Multimedia Capture',
      uploadedAt: new Date().toISOString()
    };
    list.unshift(item);
    setStore(STORAGE_KEYS.MEDIA, list);
    return item;
  },
  deleteMedia(id: string): void {
    const list = this.getMedia().filter(m => m._id !== id);
    setStore(STORAGE_KEYS.MEDIA, list);
  },

  // Documents
  getDocuments(vehicleId?: number): VehicleDocument[] {
    const list = getStore<VehicleDocument>(STORAGE_KEYS.DOCUMENTS, initialDocuments);
    return vehicleId ? list.filter(d => d.vehicleId === vehicleId) : list;
  },
  saveDocument(vehicleId: number, name: string, type: string): VehicleDocument {
    const list = getStore<VehicleDocument>(STORAGE_KEYS.DOCUMENTS, initialDocuments);
    const item: VehicleDocument = {
      _id: 'doc_' + Date.now().toString(36),
      vehicleId,
      documentType: type || 'Registration Document',
      fileName: name || `Doc-${vehicleId}-${Date.now()}.pdf`,
      url: 'https://example.com/docs/' + name,
      status: 'VALID',
      uploadedAt: new Date().toISOString()
    };
    list.unshift(item);
    setStore(STORAGE_KEYS.DOCUMENTS, list);
    return item;
  },
  deleteDocument(id: string): void {
    const list = getStore<VehicleDocument>(STORAGE_KEYS.DOCUMENTS, initialDocuments).filter(d => d._id !== id);
    setStore(STORAGE_KEYS.DOCUMENTS, list);
  },

  // Dashboard Aggregates & Reports
  getDashboardStats(): DashboardStats {
    const vehicles = this.getVehicles();
    const drivers = this.getDrivers();
    const trips = this.getTrips();
    const bookings = this.getBookings();
    const maintenance = this.getMaintenance();

    const activeDrivers = drivers.filter(d => d.status === 'ACTIVE' || d.status === 'ON_TRIP').length;
    const maintenanceDue = maintenance.filter(m => m.status === 'SCHEDULED' || m.status === 'OVERDUE').length;
    
    // Today's trips
    const today = new Date().toISOString().split('T')[0];
    const todaysTrips = trips.filter(t => t.departureDate === today || t.status === 'IN_PROGRESS' || t.status === 'SCHEDULED').length;

    // Today's bookings and revenue
    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED');
    const todaysRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return {
      totalVehicles: vehicles.length,
      activeDrivers,
      todaysTrips: todaysTrips || trips.length,
      todaysBookings: confirmedBookings.length,
      todaysRevenue: todaysRevenue || 14250,
      maintenanceDue
    };
  },

  getRevenueReport(startDate?: string, endDate?: string): RevenueReport {
    const bookings = this.getBookings().filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED');
    const totalRev = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const tickets = bookings.reduce((sum, b) => sum + (b.ticketQuantity || 1), 0);
    
    // Dynamic 7-day breakdown
    const dailyBreakdown = [
      { date: '2026-10-05', revenue: 14200, tickets: 12 },
      { date: '2026-10-06', revenue: 16800, tickets: 15 },
      { date: '2026-10-07', revenue: 15500, tickets: 14 },
      { date: '2026-10-08', revenue: 18900, tickets: 18 },
      { date: '2026-10-09', revenue: 21400, tickets: 20 },
      { date: '2026-10-10', revenue: 24500, tickets: 24 },
      { date: '2026-10-11', revenue: totalRev > 0 ? totalRev : 22800, tickets: tickets > 0 ? tickets : 22 },
    ];

    return {
      totalRevenue: totalRev > 0 ? totalRev : 134100,
      ticketsSold: tickets > 0 ? tickets : 125,
      averageTicketValue: tickets > 0 ? totalRev / tickets : 1072.8,
      periodStart: startDate || '2026-10-05',
      periodEnd: endDate || '2026-10-11',
      dailyBreakdown
    };
  },

  getTripPerformance(): TripPerformanceReport[] {
    const trips = this.getTrips();
    return trips.map(t => {
      const booked = t.bookedSeats || 0;
      const cap = t.capacity || 45;
      const occPercent = cap > 0 ? (booked / cap) * 100 : 0;
      return {
        tripId: t.tripId,
        route: `${t.routeOrigin} → ${t.routeDestination}`,
        vehicle: t.vehicleRegistration || `Vehicle ${t.vehicleId}`,
        capacity: cap,
        bookedSeats: booked,
        availableSeats: Math.max(0, cap - booked),
        occupancyPercent: occPercent,
        revenue: booked * (t.fare || 1000)
      };
    });
  },

  getMaintenanceDueReports(): MaintenanceDueReport[] {
    const maintenance = this.getMaintenance().filter(m => m.status === 'SCHEDULED' || m.status === 'OVERDUE');
    return maintenance.map(m => ({
      vehicleId: m.vehicleId,
      vehicleRegistration: m.vehicleRegistration || `Vehicle #${m.vehicleId}`,
      lastMaintenance: m.maintenanceDate,
      nextMaintenance: m.nextMaintenanceDate || m.maintenanceDate,
      status: m.status,
      daysOverdue: m.status === 'OVERDUE' ? 3 : 0
    }));
  },

  getRouteUsageReports(): RouteUsageReport[] {
    const routes = this.getRoutes();
    const bookings = this.getBookings();

    return routes.map((r, i) => {
      const count = bookings.filter(b => b.routeOrigin === r.origin && b.routeDestination === r.destination).length;
      return {
        routeId: r.routeId,
        origin: r.origin,
        destination: r.destination,
        bookingCount: (r.tripCount || 10) + count,
        rank: i + 1
      };
    }).sort((a, b) => b.bookingCount - a.bookingCount).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }
};
