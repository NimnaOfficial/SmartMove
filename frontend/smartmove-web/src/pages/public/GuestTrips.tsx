import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, MapPin, Clock, Users, ArrowRight, 
  Bus, ShieldCheck, Filter, AlertCircle, RefreshCw, LogIn
} from 'lucide-react';
import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/footer/Footer';
import tripService from '@/services/tripService';
import authService from '@/services/authService';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

export default function GuestTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      let data: any[];
      if (origin || destination || date || maxPrice) {
        data = await tripService.search({
          origin: origin || undefined,
          destination: destination || undefined,
          date: date || undefined,
          maxPrice: maxPrice || undefined
        });
      } else {
        data = await tripService.getAll();
      }
      setTrips(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to connect to live transit services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  const handleBook = (tripId: number) => {
    if (authService.isAuthenticated()) {
      navigate('/passenger/trips', { state: { selectedTripId: tripId } });
    } else {
      navigate('/login', { 
        state: { 
          from: { pathname: '/passenger/trips' },
          message: 'Please sign in or create an account to book your tickets.' 
        } 
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-28 pb-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-950 via-[#121c33] to-[#1e3f7a] text-white py-20 px-8 md:px-16 lg:px-24 xl:px-32 overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-blue-400/20"
            >
              <Bus className="w-3.5 h-3.5 text-blue-400" />
              <span>Real-Time Transit Schedule</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              Explore Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Trips</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed"
            >
              Browse live schedules across Sri Lanka. Secure seats with instant confirmations on luxury and express buses.
            </motion.p>
          </div>

          {/* Search Card */}
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="relative z-10 max-w-5xl mx-auto mt-12 bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/40 text-gray-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> From
                </label>
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Colombo"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> To
                </label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kandy"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col justify-end">
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" /> Find Trips
                </button>
              </div>
            </div>
          </motion.form>
        </div>

        {/* Trips Results Section */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mt-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Available Departures</h2>
              <p className="text-sm text-gray-500 mt-1">Showing real-time schedules from our central transit network</p>
            </div>

            <button 
              onClick={() => { setOrigin(''); setDestination(''); setDate(''); fetchTrips(); }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-blue-600 bg-white border border-gray-200 px-4 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-gray-500">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium">Fetching real-time trip schedules...</p>
            </div>
          ) : error ? (
            <div className="my-12 p-8 bg-red-50 border border-red-200 rounded-3xl text-center max-w-xl mx-auto">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-red-800">Connection Error</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <button 
                onClick={fetchTrips}
                className="mt-4 px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : trips.length === 0 ? (
            <div className="py-24 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Bus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No Trips Found</h3>
              <p className="text-sm text-gray-500 mt-2">
                There are no scheduled trips matching your search criteria. Try modifying your dates or locations.
              </p>
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            >
              {trips.map((trip: any) => {
                const tripId = trip.tripId || trip.TRIP_ID;
                const originLoc = trip.origin || trip.route?.origin || 'Origin';
                const destLoc = trip.destination || trip.route?.destination || 'Destination';
                const depTime = trip.departureTime ? new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:00 AM';
                const depDate = trip.departureTime ? new Date(trip.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Daily';
                const seats = trip.availableSeats !== undefined ? trip.availableSeats : (trip.route?.capacity || 40);
                const fare = trip.fare || trip.baseFare || trip.route?.baseFare || 1500;
                const vehicleType = trip.vehicleType || trip.vehicle?.type || 'Luxury Coach';

                return (
                  <motion.div 
                    key={tripId}
                    variants={fadeUp}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                          {vehicleType}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          <Users className="w-3.5 h-3.5" />
                          <span>{seats} seats left</span>
                        </div>
                      </div>

                      {/* Route Header */}
                      <div className="flex items-center justify-between gap-3 my-4">
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Departure</p>
                          <h4 className="text-lg font-bold text-gray-900 tracking-tight">{originLoc}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{depTime}</p>
                        </div>

                        <div className="flex flex-col items-center px-2">
                          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div className="flex-1 text-right">
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Arrival</p>
                          <h4 className="text-lg font-bold text-gray-900 tracking-tight">{destLoc}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{depDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer / Price & Action */}
                    <div className="pt-5 border-t border-gray-100 mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Standard Fare</p>
                        <p className="text-xl font-extrabold text-gray-900">
                          LKR {fare.toLocaleString()}
                        </p>
                      </div>

                      <button 
                        onClick={() => handleBook(tripId)}
                        className="flex items-center gap-2 bg-[#1e3f7a] text-white hover:bg-blue-600 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all shadow-md group-hover:shadow-blue-600/30"
                      >
                        <span>Book Seat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
