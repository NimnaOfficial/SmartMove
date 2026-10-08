import { useState, useEffect } from 'react';
import tripService from '@/services/tripService';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, Calendar, Car, ShieldCheck, 
  AlertTriangle, Navigation
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function TripDetails() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState<any>(null);
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = useState('Scheduled');

  // Mock data
  useEffect(() => {
    const fetchTrip = async () => {
       try {
          if (tripId) {
             const data = await tripService.getById(Number(tripId.replace(/\D/g,''))); // strip prefix if needed
             setTripData(data);
          }
       } catch (e) {
          console.error(e);
       }
    };
    fetchTrip();
  }, [tripId]);
  
  const trip = tripData || {
    id: tripId || 'TRP-1001',
    route: 'Coastal Express',
    from: 'Colombo',
    to: 'Galle',
    date: 'Oct 15, 2026',
    departure: '08:30 AM',
    arrival: '11:00 AM',
    vehicle: {
      number: 'ND-4521',
      model: 'Volvo 9900',
      capacity: 45,
      maintenance: 'Cleared'
    },
    passengers: 38,
    status: tripStatus
  };

  const handleUpdateStatus = (newStatus: string) => {
    setTripStatus(newStatus);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto h-full pb-10">
      
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            Trip Details
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              tripStatus === 'Completed' ? 'bg-gray-100 text-gray-600' :
              tripStatus === 'In Progress' ? 'bg-blue-50 text-blue-600' :
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
                  <p className="text-sm font-bold text-gray-400 mb-1">Departure</p>
                  <h4 className="text-xl font-bold text-gray-900">{trip.from}</h4>
                  <div className="flex items-center gap-4 mt-3 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {trip.departure}</span>
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-2.4rem] w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 ring-4 ring-white z-10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex-1">
                  <p className="text-sm font-bold text-gray-400 mb-1">Estimated Arrival</p>
                  <h4 className="text-xl font-bold text-gray-900">{trip.to}</h4>
                  <div className="flex items-center gap-4 mt-3 text-sm font-medium text-gray-600">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {trip.arrival}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Actions</h3>
             <div className="flex flex-wrap gap-3">
               <button 
                 onClick={() => handleUpdateStatus('In Progress')}
                 disabled={tripStatus === 'In Progress' || tripStatus === 'Completed'}
                 className="flex-1 bg-black text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Start Trip
               </button>
               <button 
                 onClick={() => handleUpdateStatus('Completed')}
                 disabled={tripStatus === 'Completed' || tripStatus === 'Scheduled'}
                 className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Complete Trip
               </button>
               <button 
                 onClick={() => alert('Issue reporting module will open here.')}
                 className="flex-none bg-red-50 text-red-600 py-3 px-4 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
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
                <p className="text-lg font-bold text-gray-900">{trip.vehicle.number}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Model</p>
                   <p className="text-sm font-bold text-gray-900">{trip.vehicle.model}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Capacity</p>
                   <p className="text-sm font-bold text-gray-900">{trip.vehicle.capacity} Seats</p>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold">Maintenance {trip.vehicle.maintenance}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-black text-white rounded-[1.5rem] p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4">Passenger Manifest</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-extrabold">{trip.passengers}</p>
                <p className="text-gray-400 text-sm font-medium mt-1">Booked Seats</p>
              </div>
              <button 
                onClick={() => alert(`Showing manifest for ${trip.passengers} passengers.`)}
                className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                View List
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
