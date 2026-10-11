import { useState, useEffect } from 'react';
import tripService from '@/services/tripService';
import driverService from '@/services/driverService';
import chatService from '@/services/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, Calendar, Car, ShieldCheck, 
  AlertTriangle, Navigation, Users, CheckCircle2, Phone, X, Send
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function TripDetails() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState<any>(null);
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = useState('SCHEDULED');
  const [showManifest, setShowManifest] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [issueCategory, setIssueCategory] = useState<'traffic' | 'mechanical' | 'medical' | 'other'>('traffic');
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  const rawId = tripId ? Number(tripId.replace(/\D/g, '')) : 1001;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        if (tripId) {
          const data = await tripService.getById(rawId);
          if (data) {
            setTripData(data);
            setTripStatus(data.status || 'SCHEDULED');
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrip();
  }, [tripId, rawId]);

  const trip = {
    id: `TRP-${tripData?.tripId || rawId}`,
    route: `${tripData?.routeOrigin || 'Colombo'} ➔ ${tripData?.routeDestination || 'Galle'}`,
    from: tripData?.routeOrigin || 'Colombo Fort',
    to: tripData?.routeDestination || 'Galle Bus Stand',
    date: tripData?.departureTime ? new Date(tripData.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
    departure: tripData?.departureTime ? new Date(tripData.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 AM',
    arrival: tripData?.arrivalTime ? new Date(tripData.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:00 AM',
    vehicle: {
      number: tripData?.vehicleRegistration || 'WP-ND-4521',
      model: 'Volvo 9900 Luxury Coach',
      capacity: tripData?.totalSeats || 45,
      maintenance: 'Cleared & Inspected'
    },
    passengers: tripData?.availableSeats ? (tripData.totalSeats || 45) - tripData.availableSeats : 38,
    status: tripStatus
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setTripStatus(newStatus);
      await driverService.updateTripStatus(rawId, newStatus);
      // Broadcast real-time message to dispatch
      await chatService.sendMessage(
        'conv-fleet-dispatch',
        `Unit status update: Trip #${trip.id} is now ${newStatus}.`,
        newStatus === 'IN_PROGRESS' ? 'text' : 'alert'
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;

    await chatService.sendMessage(
      'conv-fleet-dispatch',
      `[${issueCategory.toUpperCase()} ALERT] Trip #${trip.id} (${trip.route}): ${issueText}`,
      'alert'
    );

    setIssueSubmitted(true);
    setTimeout(() => {
      setShowIssueModal(false);
      setIssueSubmitted(false);
      setIssueText('');
    }, 1500);
  };

  const passengerManifest = [
    { seat: '01A', name: 'Kasun Jayawardena', phone: '+94 70 987 6543', status: 'Boarded' },
    { seat: '02B', name: 'Elena Rostova', phone: '+94 72 876 5432', status: 'Boarded' },
    { seat: '05A', name: 'Nalaka Bandara', phone: '+94 77 345 6789', status: 'Boarded' },
    { seat: '08C', name: 'Sanduni Fernando', phone: '+94 71 223 3445', status: 'Reserved' },
    { seat: '12A', name: 'Ruwan Wijesinghe', phone: '+94 76 554 4332', status: 'Boarded' },
    { seat: '14B', name: 'Priya Sharma', phone: '+94 77 889 9001', status: 'Boarded' },
    { seat: '16A', name: 'Dinuka Perera', phone: '+94 75 443 2211', status: 'Reserved' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto h-full pb-10">
      
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/driver/trips')}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            Trip Details
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              tripStatus === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
              tripStatus === 'IN_PROGRESS' ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
              'bg-black text-white'
            }`}>
              {tripStatus}
            </span>
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">{trip.id} • {trip.route}</p>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Route & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5" /> Route & Schedule
            </h3>
            
            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {/* Departure */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-2.4rem] w-8 h-8 rounded-full bg-black flex items-center justify-center text-white ring-4 ring-white z-10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Origin Terminal</span>
                  <p className="font-bold text-gray-900 text-base">{trip.from}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Departure: {trip.departure} ({trip.date})
                  </p>
                </div>
              </div>

              {/* Arrival */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-2.4rem] w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white ring-4 ring-white z-10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Destination</span>
                  <p className="font-bold text-gray-900 text-base">{trip.to}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Expected Arrival: {trip.arrival}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Controls</h3>
             <div className="flex flex-wrap gap-3">
               <button 
                 onClick={() => handleUpdateStatus('IN_PROGRESS')}
                 disabled={tripStatus === 'IN_PROGRESS' || tripStatus === 'COMPLETED'}
                 className="flex-1 bg-black text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
               >
                 Start Journey
               </button>
               <button 
                 onClick={() => handleUpdateStatus('COMPLETED')}
                 disabled={tripStatus === 'COMPLETED' || tripStatus === 'SCHEDULED'}
                 className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
               >
                 Complete Trip
               </button>
               <button 
                 onClick={() => setShowIssueModal(true)}
                 className="flex-none bg-red-50 text-red-600 py-3 px-4 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2 cursor-pointer border border-red-200"
               >
                 <AlertTriangle className="w-4 h-4" /> Report Issue
               </button>
             </div>
          </motion.div>
        </div>

        {/* Right Column: Vehicle & Info */}
        <div className="space-y-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5" /> Assigned Vehicle
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registration</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{trip.vehicle.number}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Model</p>
                   <p className="text-xs font-bold text-gray-900 truncate">{trip.vehicle.model}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Capacity</p>
                   <p className="text-sm font-bold text-gray-900">{trip.vehicle.capacity} Seats</p>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold">{trip.vehicle.maintenance}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-black text-white rounded-[1.5rem] p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-300" /> Passenger Manifest
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-extrabold">{trip.passengers}</p>
                <p className="text-gray-400 text-sm font-medium mt-1">Booked Passengers</p>
              </div>
              <button 
                onClick={() => setShowManifest(true)}
                className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                View List
              </button>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Passenger Manifest Modal */}
      <AnimatePresence>
        {showManifest && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Passenger Manifest</h3>
                  <p className="text-xs text-gray-500">{trip.id} • {trip.passengers} passengers booked</p>
                </div>
                <button onClick={() => setShowManifest(false)} className="p-2 text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar my-4 space-y-2">
                {passengerManifest.map((p, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-black text-white font-bold text-xs flex items-center justify-center">
                        {p.seat}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {p.phone}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                      p.status === 'Boarded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowManifest(false)}
                className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Close Manifest
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Issue & Alert Central Dispatch Modal */}
      <AnimatePresence>
        {showIssueModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900">Report Operational Alert</h3>
                </div>
                <button onClick={() => setShowIssueModal(false)} className="p-2 text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {issueSubmitted ? (
                <div className="py-8 text-center text-emerald-600 font-bold space-y-2">
                  <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                  <p>Alert transmitted to Central Dispatch in real time!</p>
                </div>
              ) : (
                <form onSubmit={handleReportIssue} className="my-4 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Issue Category</label>
                    <select
                      value={issueCategory}
                      onChange={(e: any) => setIssueCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
                    >
                      <option value="traffic">Traffic Congestion / Reroute</option>
                      <option value="mechanical">Mechanical / Vehicle Breakdown</option>
                      <option value="medical">Medical or Passenger Emergency</option>
                      <option value="other">General Operational Delay</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Details for Dispatch</label>
                    <textarea
                      required
                      rows={3}
                      value={issueText}
                      onChange={(e) => setIssueText(e.target.value)}
                      placeholder="Describe location, condition, or assistance needed..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none resize-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowIssueModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" /> Transmit Alert
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
