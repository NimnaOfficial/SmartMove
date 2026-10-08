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
          <Route path="announcements" element={<Announcements />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
