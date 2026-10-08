import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, ShieldCheck, Users, ArrowRight, Filter, ChevronDown, Check, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import tripService from '@/services/tripService';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

/* removed mockTrips */

type SortOption = 'earliest' | 'latest' | 'price_asc' | 'price_desc';

export default function SearchTrips() {
  const location = useLocation();
  const state = location.state as any;

  const [origin, setOrigin] = useState(state?.origin || '');
  const [destination, setDestination] = useState(state?.destination || '');
  const [date, setDate] = useState(state?.date || '');
  
  const [searchCriteria, setSearchCriteria] = useState({ 
    origin: state?.origin || '', 
    destination: state?.destination || '', 
    date: state?.date || '' 
  });
  
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'details' | 'book'>('details');
  const [sortBy, setSortBy] = useState<SortOption>('earliest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('All');
  
  useEffect(() => {
    if (state?.origin || state?.destination || state?.date) {
      handleSearch(new Event('submit') as any);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setSearchCriteria({ origin, destination, date });
      setIsSearching(false);
    }, 600);
  };

  
  const [trips, setTrips] = useState<any[]>([]);
  useEffect(() => {
    const fetchTrips = async () => {
       try {
          const data = await tripService.search({
             origin: searchCriteria.origin,
             destination: searchCriteria.destination,
             date: searchCriteria.date
          });
          setTrips(Array.isArray(data) ? data : []);
       } catch(e) {
          console.error(e);
       }
    };
    fetchTrips();
  }, [searchCriteria]);
  
  const filteredAndSortedTrips = useMemo(() => {
    let result = [...trips];


    // Search Criteria
    if (searchCriteria.origin) {
      result = result.filter(t => t.origin.toLowerCase().includes(searchCriteria.origin.toLowerCase()));
    }
    if (searchCriteria.destination) {
      result = result.filter(t => t.destination.toLowerCase().includes(searchCriteria.destination.toLowerCase()));
    }
    if (searchCriteria.date) {
      result = result.filter(t => t.date === searchCriteria.date);
    }

    // Advanced Filters
    result = result.filter(t => t.fare <= maxPrice);
    if (selectedVehicle !== 'All') {
      result = result.filter(t => t.vehicle.includes(selectedVehicle));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.fare - b.fare;
      if (sortBy === 'price_desc') return b.fare - a.fare;
      
      const timeA = new Date(`${a.date} ${a.departureTime}`).getTime();
      const timeB = new Date(`${b.date} ${b.departureTime}`).getTime();
      
      if (sortBy === 'earliest') return timeA - timeB;
      if (sortBy === 'latest') return timeB - timeA;
      return 0;
    });

    return result;
  }, [searchCriteria, sortBy, maxPrice, selectedVehicle]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'earliest', label: 'Earliest' },
    { value: 'latest', label: 'Latest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ];

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
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative z-20">
          <div className="text-sm text-gray-500 font-medium">
            Found <span className="text-gray-900 font-bold">{filteredAndSortedTrips.length}</span> trips available
          </div>
          <div className="flex items-center gap-4 text-sm relative">
            <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 text-gray-600 hover:text-[#1e3f7a] transition-colors font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div className="relative">
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#1e3f7a] transition-colors font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
              >
                Sort by: {sortOptions.find(o => o.value === sortBy)?.label} <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setShowSortDropdown(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${sortBy === option.value ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {option.label}
                        {sortBy === option.value && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Trip Results List */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-5"
        >
          {filteredAndSortedTrips.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[1.5rem] border border-gray-100">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-1">No trips found</h3>
               <p className="text-gray-500">Try adjusting your search criteria or viewing a different date.</p>
               <button onClick={() => { setSearchCriteria({origin:'', destination:'', date:''}); setOrigin(''); setDestination(''); setDate(''); setMaxPrice(50); setSelectedVehicle('All'); }} className="mt-6 text-[#1e3f7a] font-semibold hover:underline">
                 Clear all filters
               </button>
            </div>
          ) : (
            filteredAndSortedTrips.map((trip) => (
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
                    <button 
                      onClick={() => { setSelectedTrip(trip); setModalMode('details'); }}
                      className="flex-1 lg:flex-none px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => { setSelectedTrip(trip); setModalMode('book'); }}
                      className="flex-1 lg:flex-none px-6 py-3 rounded-full bg-[#1e3f7a] text-white font-semibold hover:bg-[#152e5e] shadow-[0_8px_20px_rgba(30,63,122,0.2)] hover:-translate-y-0.5 transition-all group-hover:shadow-[0_8px_30px_rgba(30,63,122,0.4)]"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Modal Popups */}
        <AnimatePresence>
          {selectedTrip && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e3f7a]/40 backdrop-blur-sm"
              onClick={() => setSelectedTrip(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="bg-[#1e3f7a] p-6 text-white flex justify-between items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold">
                      {modalMode === 'details' ? 'Trip Details' : 'Complete Your Booking'}
                    </h3>
                    <p className="text-blue-200 text-sm mt-1">{selectedTrip.route}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTrip(null)}
                    className="relative z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                  {modalMode === 'details' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedTrip.departureTime}</p>
                          <p className="text-sm text-gray-500 font-medium">{selectedTrip.origin}</p>
                        </div>
                        <div className="flex-1 px-8 flex items-center">
                          <div className="h-[2px] w-full bg-gray-200 relative">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-blue-600 border border-gray-200 rounded-full">
                               {selectedTrip.date}
                             </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedTrip.arrivalTime}</p>
                          <p className="text-sm text-gray-500 font-medium">{selectedTrip.destination}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Vehicle</p>
                          <p className="font-bold text-gray-900">{selectedTrip.vehicle}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Available Seats</p>
                          <p className="font-bold text-green-600">{selectedTrip.availableSeats}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Fare</p>
                          <p className="font-bold text-[#1e3f7a]">${selectedTrip.fare.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Status</p>
                          <p className="font-bold text-gray-900">{selectedTrip.status}</p>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button 
                          onClick={() => setModalMode('book')}
                          className="px-8 py-3 rounded-xl bg-[#1e3f7a] text-white font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
                        >
                          Book This Trip
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{selectedTrip.origin} to {selectedTrip.destination}</p>
                          <p className="text-sm text-gray-500">{selectedTrip.date} at {selectedTrip.departureTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Fare per seat</p>
                          <p className="font-bold text-[#1e3f7a] text-xl">${selectedTrip.fare.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Number of Passengers</label>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-[#1e3f7a] font-medium">
                               <option>1 Passenger</option>
                               <option>2 Passengers</option>
                               <option>3 Passengers</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                               <button className="py-3 border-2 border-[#1e3f7a] bg-blue-50 text-[#1e3f7a] font-bold rounded-xl">Credit Card</button>
                               <button className="py-3 border-2 border-gray-100 bg-white text-gray-500 font-bold rounded-xl hover:bg-gray-50">Cash / Branch</button>
                            </div>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                         <div>
                            <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                            <p className="text-3xl font-bold text-[#1e3f7a]">${selectedTrip.fare.toFixed(2)}</p>
                         </div>
                         <button 
                           onClick={() => setSelectedTrip(null)}
                           className="px-8 py-3.5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 flex items-center gap-2"
                         >
                           <ShieldCheck className="w-5 h-5" /> Confirm Payment
                         </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Filters Modal */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-[#1e3f7a]/40 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            >
              <motion.div 
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-md h-full rounded-[2rem] shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Advanced Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto space-y-8">
                  {/* Price Range Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Maximum Price: ${maxPrice}</h4>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#1e3f7a]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>$10</span>
                      <span>$100</span>
                    </div>
                  </div>

                  {/* Vehicle Type Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Vehicle Type</h4>
                    <div className="space-y-3">
                      {['All', 'Coach', 'Bus'].map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="vehicle"
                            checked={selectedVehicle === type}
                            onChange={() => setSelectedVehicle(type)}
                            className="w-4 h-4 text-[#1e3f7a]"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex gap-3">
                  <button onClick={() => { setMaxPrice(50); setSelectedVehicle('All'); }} className="flex-1 py-3 font-semibold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100">
                    Reset
                  </button>
                  <button onClick={() => setShowFilters(false)} className="flex-[2] py-3 font-semibold text-white bg-[#1e3f7a] rounded-xl hover:bg-[#152e5e]">
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
  );
}
