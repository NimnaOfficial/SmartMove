import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, ShieldCheck, Users, ArrowRight, Filter, ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Mock Trips
const mockTrips = [
  { id: 1, route: 'Express City Line', origin: 'Colombo', destination: 'Kandy', date: '2026-10-15', departureTime: '08:00 AM', arrivalTime: '11:30 AM', vehicle: 'Luxury Coach', availableSeats: 12, fare: 25.00, status: 'On Time' },
  { id: 2, route: 'Coastal Cruiser', origin: 'Colombo', destination: 'Galle', date: '2026-10-15', departureTime: '09:15 AM', arrivalTime: '11:45 AM', vehicle: 'Standard Bus', availableSeats: 24, fare: 15.00, status: 'On Time' },
  { id: 3, route: 'Mountain Pass', origin: 'Kandy', destination: 'Nuwara Eliya', date: '2026-10-16', departureTime: '07:30 AM', arrivalTime: '10:00 AM', vehicle: 'Mini Coach', availableSeats: 5, fare: 18.50, status: 'Scheduled' },
  { id: 4, route: 'Northern Star', origin: 'Colombo', destination: 'Jaffna', date: '2026-10-17', departureTime: '10:00 PM', arrivalTime: '06:00 AM', vehicle: 'Sleeper Bus', availableSeats: 18, fare: 45.00, status: 'Scheduled' },
];

export default function SearchTrips() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate network request
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-8 w-full pb-10">
        
        {/* Header Section */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Search Trips</h1>
            <p className="text-gray-500 mt-2 font-light">Find and book your next journey across the network.</p>
          </div>
        </motion.div>

        {/* Search Filter Panel (Glassmorphism + Dark Navy) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.2 }}
          className="bg-[#1e3f7a] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group"
        >
          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-400/30 transition-colors duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 group-hover:bg-purple-400/30 transition-colors duration-700" />

          <form onSubmit={handleSearch} className="relative z-10 flex flex-col xl:flex-row gap-6">
            
            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 transition-colors focus-within:bg-white/20 focus-within:border-white/40">
              <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">Origin City</label>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/70" />
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Where are you leaving from?" 
                  className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-center -mx-3 xl:mx-0 xl:-my-3 z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/30 rotate-90 xl:rotate-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 transition-colors focus-within:bg-white/20 focus-within:border-white/40">
              <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">Destination City</label>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/70" />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you heading to?" 
                  className="bg-transparent border-none outline-none text-white placeholder-white/40 w-full font-medium"
                />
              </div>
            </div>

            <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 transition-colors focus-within:bg-white/20 focus-within:border-white/40 xl:max-w-[250px]">
              <label className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold block mb-2">Travel Date</label>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-white/70" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-white w-full font-medium [color-scheme:dark]"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="bg-white text-[#1e3f7a] rounded-2xl px-8 py-4 font-bold shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 h-[84px] xl:w-auto w-full"
            >
              {isSearching ? (
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Search className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <Search className="w-5 h-5" /> Search
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results Toolbar */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 font-medium">
            Found <span className="text-gray-900 font-bold">{mockTrips.length}</span> trips available
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#1e3f7a] transition-colors font-medium">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#1e3f7a] transition-colors font-medium">
              Sort by: Earliest <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Trip Results List */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-5"
        >
          {mockTrips.map((trip) => (
            <motion.div 
              key={trip.id} 
              variants={fadeUp}
              className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300 flex flex-col lg:flex-row gap-6 lg:gap-8 group"
            >
              {/* Left: Time & Locations */}
              <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                <div className="text-center md:text-left w-full md:w-auto">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{trip.departureTime}</p>
                  <p className="text-gray-500 font-medium">{trip.origin}</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center w-full px-4 relative min-w-[150px]">
                  <p className="text-xs text-blue-600 font-bold mb-2 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{trip.route}</p>
                  <div className="w-full flex items-center relative">
                    <div className="h-[2px] w-full bg-gray-200 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ x: '-100%' }}
                         whileInView={{ x: '100%' }}
                         transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                         className="h-full w-1/2 bg-blue-400"
                       />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 absolute -right-2 bg-white" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-medium">{trip.date}</p>
                </div>

                <div className="text-center md:text-right w-full md:w-auto">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{trip.arrivalTime}</p>
                  <p className="text-gray-500 font-medium">{trip.destination}</p>
                </div>
              </div>

              {/* Middle: Specs */}
              <div className="hidden lg:flex flex-col justify-center gap-3 px-8 border-l border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-[#1e3f7a]" /></div>
                  <span className="font-medium">{trip.vehicle}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center"><Users className="w-4 h-4 text-green-600" /></div>
                  <span className="font-medium">{trip.availableSeats} seats left</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center"><Clock className="w-4 h-4 text-purple-600" /></div>
                  <span className="font-medium">{trip.status}</span>
                </div>
              </div>

              {/* Right: Pricing & CTA */}
              <div className="flex flex-col items-center lg:items-end justify-center lg:border-l lg:border-gray-100 lg:pl-8">
                <p className="text-sm text-gray-400 font-medium mb-1">Total Fare</p>
                <p className="text-4xl font-bold text-[#1e3f7a] mb-5">${trip.fare.toFixed(2)}</p>
                <div className="flex gap-3 w-full lg:w-auto">
                  <button className="flex-1 lg:flex-none px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    Details
                  </button>
                  <button className="flex-1 lg:flex-none px-6 py-3 rounded-full bg-[#1e3f7a] text-white font-semibold hover:bg-[#152e5e] shadow-[0_8px_20px_rgba(30,63,122,0.2)] hover:-translate-y-0.5 transition-all group-hover:shadow-[0_8px_30px_rgba(30,63,122,0.4)]">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
  );
}
