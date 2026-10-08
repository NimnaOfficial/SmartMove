import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Home from '@/pages/home/Home';
import SearchTrips from '@/pages/passenger/trips/SearchTrips';
import Announcements from '@/pages/passenger/announcements/Announcements';
import About from '@/pages/about/About';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import PassengerDashboard from '@/pages/passenger/dashboard/PassengerDashboard';
import PassengerLayout from '@/components/layout/PassengerLayout';
import MyBookings from '@/pages/passenger/bookings/MyBookings';
import Profile from '@/pages/passenger/profile/Profile';
import Feedback from '@/pages/passenger/feedback/Feedback';
import TravelHistory from '@/pages/passenger/history/TravelHistory';
import Media from '@/pages/passenger/media/Media';

// Admin Imports
import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboard from '@/pages/admin/dashboard/AdminDashboard';
import AdminVehicles from '@/pages/admin/vehicles/AdminVehicles';
import AdminDrivers from '@/pages/admin/drivers/AdminDrivers';
import AdminRoutes from '@/pages/admin/routes/AdminRoutes';
import AdminTrips from '@/pages/admin/trips/AdminTrips';
import AdminBookings from '@/pages/admin/bookings/AdminBookings';
import AdminMaintenance from '@/pages/admin/maintenance/AdminMaintenance';
import AdminFeedback from '@/pages/admin/feedback/AdminFeedback';
import AdminReports from '@/pages/admin/reports/AdminReports';
import AdminContent from '@/pages/admin/content/AdminContent';

// Driver Imports
import DriverLayout from '@/components/layout/DriverLayout';
import DriverDashboard from '@/pages/driver/dashboard/DriverDashboard';
import MyTrips from '@/pages/driver/trips/MyTrips';
import TripDetails from '@/pages/driver/trips/TripDetails';
import DriverProfile from '@/pages/driver/profile/DriverProfile';
import DriverNotifications from '@/pages/driver/notifications/DriverNotifications';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Passenger Routes using Shared Layout */}
        <Route path="/passenger" element={<PassengerLayout />}>
          <Route path="dashboard" element={<PassengerDashboard />} />
          <Route path="trips" element={<SearchTrips />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="travel-history" element={<TravelHistory />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="media" element={<Media />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes using Shared Ethereal Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="routes" element={<AdminRoutes />} />
          <Route path="trips" element={<AdminTrips />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="maintenance" element={<AdminMaintenance />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="content" element={<AdminContent />} />
        </Route>

        {/* Driver Routes */}
        <Route path="/driver" element={<DriverLayout />}>
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="trips" element={<MyTrips />} />
          <Route path="trips/:tripId" element={<TripDetails />} />
          <Route path="profile" element={<DriverProfile />} />
          <Route path="notifications" element={<DriverNotifications />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
