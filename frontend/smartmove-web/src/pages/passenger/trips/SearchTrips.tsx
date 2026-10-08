import { motion } from 'framer-motion';
import { MapPin, Calendar, Search, ArrowRight, Clock, Users, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/footer/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Mock data based on the spec
const mockTrips = [
  {
    id: 'TRP-104',
    route: 'Mountain Pass Express',
    origin: 'Denver, CO',
    destination: 'Aspen, CO',
    departureTime: '08:00 AM',
    arrivalTime: '11:30 AM',
    date: 'Oct 15, 2026',
    vehicle: 'Luxury Coach (V-201)',
    availableSeats: 12,
    fare: 45.00,
    status: 'Scheduled'
  },
  {
    id: 'TRP-105',
    route: 'Coastal Line',
    origin: 'San Francisco, CA',
    destination: 'Los Angeles, CA',
    departureTime: '09:15 AM',
    arrivalTime: '03:45 PM',
    date: 'Oct 15, 2026',
    vehicle: 'Standard Bus (V-142)',
    availableSeats: 4,
    fare: 35.00,
    status: 'Almost Full'
  },
  {
    id: 'TRP-106',
    route: 'Northern Route',
    origin: 'Seattle, WA',
    destination: 'Portland, OR',
    departureTime: '01:00 PM',
    arrivalTime: '04:15 PM',
    date: 'Oct 15, 2026',
    vehicle: 'Luxury Coach (V-205)',
    availableSeats: 28,
    fare: 30.00,
    status: 'Scheduled'
  }
];

export default function SearchTrips() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic will go here
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen font-sans">
      <Navbar />

      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop"
            alt="Search Trips Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 xl:px-32 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-4 drop-shadow-lg"
          >
            Find Your <span className="font-serif italic text-blue-300">Journey</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md"
          >
            Search across our entire network to find the perfect trip. Secure your e-ticket instantly.
          </motion.p>
        </div>
      </section>

      {/* =========================================
          SEARCH WIDGET (Overlapping Hero)
          ========================================= */}
      <section className="relative z-20 w-full px-8 md:px-16 lg:px-24 xl:px-32 -mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 max-w-6xl mx-auto"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
            
            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-gray-600 mb-2">Origin</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Where from?" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-gray-600 mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-blue-500 transition-all shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_40px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Trips
              </button>
            </div>

          </form>
        </motion.div>
      </section>

      {/* =========================================
          RESULTS SECTION
          ========================================= */}
      <section className="py-20 px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-medium text-gray-900 mb-2">Available Trips</h2>
              <p className="text-gray-500 font-light">Showing results for your search criteria.</p>
            </div>
            <div className="hidden md:block text-sm text-gray-500">
              Found {mockTrips.length} trips
            </div>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            {mockTrips.map((trip) => (
              <motion.div 
                key={trip.id} 
                variants={fadeUp}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col lg:flex-row gap-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                {/* Left: Time & Location */}
                <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center md:text-left w-full md:w-auto">
                    <p className="text-3xl font-medium text-gray-900 mb-1">{trip.departureTime}</p>
                    <p className="text-gray-500 font-light">{trip.origin}</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center w-full px-4 relative min-w-[150px]">
                    <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-widest">{trip.route}</p>
                    <div className="w-full flex items-center">
                      <div className="h-[2px] w-full bg-gray-200 rounded-full" />
                      <ArrowRight className="w-5 h-5 text-gray-300 -ml-2" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{trip.date}</p>
                  </div>

                  <div className="text-center md:text-right w-full md:w-auto">
                    <p className="text-3xl font-medium text-gray-900 mb-1">{trip.arrivalTime}</p>
                    <p className="text-gray-500 font-light">{trip.destination}</p>
                  </div>
                </div>

                {/* Middle: Details */}
                <div className="hidden lg:flex flex-col justify-center gap-3 px-8 border-l border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    {trip.vehicle}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-blue-500" />
                    {trip.availableSeats} seats available
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {trip.status}
                  </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex flex-col items-center lg:items-end justify-center lg:border-l lg:border-gray-100 lg:pl-8">
                  <p className="text-4xl font-medium text-blue-600 mb-4">${trip.fare.toFixed(2)}</p>
                  <div className="flex gap-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                      Details
                    </button>
                    <button className="flex-1 lg:flex-none px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
