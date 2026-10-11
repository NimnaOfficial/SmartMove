import { useState, useEffect } from 'react';
import driverService from '@/services/driverService';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Map, Calendar, MapPin, Search, 
  Clock, ChevronRight, Car, RefreshCw, CheckCircle2, Play
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const tabs = ['All', 'Today', 'Upcoming', 'Completed'] as const;
type TabType = typeof tabs[number];

export default function MyTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await driverService.getMyTrips();
      setTrips(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleUpdateStatus = async (tripId: number, newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await driverService.updateTripStatus(tripId, newStatus);
      fetchTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const normalizedTrips = trips.map(t => {
    const rawStatus = (t.status || 'SCHEDULED').toUpperCase();
    const isCompleted = rawStatus === 'COMPLETED';
    const isInProgress = rawStatus === 'IN_PROGRESS';
    const isUpcoming = rawStatus === 'SCHEDULED';
    
    return {
      ...t,
      displayId: `TRP-${t.tripId}`,
      route: `${t.routeOrigin || 'Colombo'} ➔ ${t.routeDestination || 'Kandy'}`,
      from: t.routeOrigin || 'Colombo',
      to: t.routeDestination || 'Kandy',
      time: t.departureTime ? new Date(t.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 AM',
      date: t.departureTime ? new Date(t.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
      duration: '2h 30m',
      vehicle: t.vehicleRegistration || 'WP-ND-4521',
      isCompleted,
      isInProgress,
      isUpcoming
    };
  });

  const filteredTrips = normalizedTrips.filter(t => {
    const matchesSearch = 
      t.route.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return t.isCompleted;
    if (activeTab === 'Today') return t.isInProgress || t.isUpcoming;
    if (activeTab === 'Upcoming') return t.isUpcoming;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto h-full pb-10">
      
      {/* Header Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black">
              <Map className="w-6 h-6" />
            </div>
            My Trips
          </h1>
          <p className="text-gray-500 mt-2 font-medium max-w-lg">
            Manage your assigned schedules, upcoming routes, and active journey status.
          </p>
        </div>
        
        {/* Search & Refresh */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by route, vehicle, or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-black transition-all"
            />
          </div>
          <button
            onClick={fetchTrips}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors"
            title="Refresh trips"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-4 border-b border-gray-100 w-full overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-3 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="driverTripTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-t-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Trips List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <motion.div 
                  key={trip.tripId}
                  variants={fadeUp}
                  className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 hover:border-gray-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <span className="text-xs font-bold text-gray-400 tracking-widest">{trip.displayId}</span>
                       <h3 className="text-xl font-bold text-gray-900 mt-1">{trip.route}</h3>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trip.isCompleted ? 'bg-gray-100 text-gray-600' :
                        trip.isInProgress ? 'bg-emerald-100 text-emerald-700 animate-pulse font-extrabold' :
                        'bg-blue-50 text-blue-600 font-extrabold'
                     }`}>
                        {trip.status || 'SCHEDULED'}
                     </span>
                  </div>

                  <div className="space-y-3 mb-6">
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" /> {trip.from} to {trip.to}
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" /> {trip.date}
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" /> {trip.time}
                     </div>
                     <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                        <Car className="w-4 h-4 text-gray-400" /> {trip.vehicle}
                     </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    {trip.isUpcoming && (
                      <button
                        onClick={(e) => handleUpdateStatus(trip.tripId, 'IN_PROGRESS', e)}
                        className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Start Trip
                      </button>
                    )}

                    {trip.isInProgress && (
                      <button
                        onClick={(e) => handleUpdateStatus(trip.tripId, 'COMPLETED', e)}
                        className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete Trip
                      </button>
                    )}

                    <button 
                      onClick={() => navigate(`/driver/trips/${trip.tripId}`)}
                      className="flex-1 bg-gray-50 text-black py-2.5 px-4 rounded-xl text-xs font-bold group-hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Map className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab.toLowerCase()} trips found</h3>
                <p className="text-gray-500 font-medium max-w-md">
                  You don't have any assigned schedules in this category.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
