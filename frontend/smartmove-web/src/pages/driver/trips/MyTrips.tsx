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

const tabs = ['Available Requests', 'Today', 'Upcoming', 'Completed', 'All'] as const;
type TabType = typeof tabs[number];

export default function MyTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [availableTrips, setAvailableTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('Today');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimNotice, setClaimNotice] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const [myData, openData] = await Promise.all([
        driverService.getMyTrips(),
        driverService.getAvailableTrips()
      ]);
      setTrips(Array.isArray(myData) ? myData : []);
      setAvailableTrips(Array.isArray(openData) ? openData : []);
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
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || 'Failed to update trip status');
    }
  };

  const handleClaimTrip = async (tripId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await driverService.claimTrip(tripId);
      setClaimNotice(`Trip #TRP-${tripId} accepted! It is now scheduled and assigned to your vehicle.`);
      setTimeout(() => setClaimNotice(null), 5000);
      await fetchTrips();
      setActiveTab('Today');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to claim trip');
    } finally {
      setLoading(false);
    }
  };

  const currentPool = activeTab === 'Available Requests' ? availableTrips : trips;

  const normalizedTrips = currentPool.map(t => {
    const rawStatus = (t.status || (activeTab === 'Available Requests' ? 'PENDING' : 'SCHEDULED')).toUpperCase();
    const isCompleted = rawStatus === 'COMPLETED';
    const isInProgress = rawStatus === 'IN_PROGRESS';
    const isPending = rawStatus === 'PENDING' || rawStatus === 'REQUESTED';
    const isUpcoming = rawStatus === 'SCHEDULED' || rawStatus === 'CONFIRMED';
    const isOpenRequest = activeTab === 'Available Requests' || (!t.driverId && isPending);
    const isPaid = t.isPaid !== false && t.paymentStatus !== 'UNPAID';
    
    return {
      ...t,
      displayId: `TRP-${t.tripId}`,
      route: `${t.routeOrigin || 'Colombo'} ➔ ${t.routeDestination || 'Kandy'}`,
      from: t.routeOrigin || 'Colombo',
      to: t.routeDestination || 'Kandy',
      time: t.departureTime ? new Date(t.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 AM',
      date: t.departureTime ? new Date(t.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
      duration: '2h 30m',
      vehicle: t.vehicleRegistration ? (t.vehicleModel ? `${t.vehicleModel} (${t.vehicleRegistration})` : t.vehicleRegistration) : (t.vehicle || 'Auto-assigned upon claim'),
      isCompleted,
      isInProgress,
      isPending,
      isUpcoming,
      isOpenRequest,
      isPaid
    };
  });

  const filteredTrips = normalizedTrips.filter(t => {
    const matchesSearch = 
      t.route.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.displayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === 'Available Requests') return true;
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
            Accept open passenger requests, manage scheduled routes, and update live journey progress.
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

      {/* Notice Banner */}
      {claimNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-semibold text-sm shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{claimNotice}</span>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-4 border-b border-gray-100 w-full overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-3 text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {tab === 'Available Requests' && availableTrips.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-500 text-white font-extrabold animate-pulse">
                {availableTrips.length}
              </span>
            )}
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
                     <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          trip.isOpenRequest ? 'bg-amber-100 text-amber-800 font-black border border-amber-200' :
                          trip.isCompleted ? 'bg-gray-100 text-gray-600' :
                          trip.isInProgress ? 'bg-emerald-100 text-emerald-700 animate-pulse font-extrabold' :
                          trip.isPending ? 'bg-orange-100 text-orange-700 font-extrabold' :
                          'bg-blue-50 text-blue-600 font-extrabold'
                       }`}>
                          {trip.isOpenRequest ? 'OPEN FOR CLAIMS' : (trip.status || 'SCHEDULED')}
                       </span>
                       {!trip.isOpenRequest && !trip.isCompleted && (
                         <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                           trip.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                         }`}>
                           {trip.isPaid ? 'CARD PAID' : 'CARD PAYMENT PENDING'}
                         </span>
                       )}
                     </div>
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
                    {trip.isOpenRequest && (
                      <button
                        onClick={(e) => handleClaimTrip(trip.tripId, e)}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm animate-pulse"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Schedule Trip
                      </button>
                    )}

                    {!trip.isOpenRequest && trip.isUpcoming && (
                      <button
                        onClick={(e) => handleUpdateStatus(trip.tripId, 'IN_PROGRESS', e)}
                        className="px-4 py-2.5 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Start Trip
                      </button>
                    )}

                    {!trip.isOpenRequest && trip.isInProgress && (
                      trip.isPaid ? (
                        <button
                          onClick={(e) => handleUpdateStatus(trip.tripId, 'COMPLETED', e)}
                          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors cursor-pointer shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Complete Trip
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Cannot complete trip: Passenger card payment is pending. The passenger must pay by card before this trip can be completed.");
                          }}
                          title="Cannot complete trip: Passenger card payment is pending."
                          className="px-4 py-2.5 bg-amber-500/90 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          <Clock className="w-3.5 h-3.5" /> Awaiting Card Payment
                        </button>
                      )
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
