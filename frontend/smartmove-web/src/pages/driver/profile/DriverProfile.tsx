import { useState, useEffect } from 'react';
import driverService from '@/services/driverService';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Award, Star, Activity, ShieldCheck, MapPin, X, Edit3 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DriverProfile() {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
     const fetchProfile = async () => {
        try {
           const data = await driverService.getProfile();
           if (data) setDriver(prev => ({ ...prev, ...data }));
        } catch (e) {
           console.error(e);
        }
     };
     fetchProfile();
  }, []);
  
  const [driver, setDriver] = useState({
    name: 'Saman Kumara',
    id: 'DRV-8842',
    status: 'Active',
    contact: '+94 77 123 4567',
    email: 'saman.k@smartmove.lk',
    license: 'B, C, CE',
    experience: '8 Years',
    rating: 4.8,
    reviews: 124,
    totalTrips: 856,
    performance: 'Excellent'
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       await driverService.updateProfile(driver as any);
       setIsEditing(false);
    } catch(err) {
       console.error(err);
    }
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto h-full pb-10">
      
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black">
              <User className="w-6 h-6" />
            </div>
            My Profile
          </h1>
          <p className="text-gray-500 font-medium mt-2">View and update your details, performance, and ratings.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="bg-black text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Personal Info Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-1 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
            <p className="text-sm font-bold text-gray-400 mt-1">{driver.id}</p>
            <span className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {driver.status}
            </span>
          </div>

          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{driver.contact}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{driver.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">License: {driver.license}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats & Operational Info */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-black text-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Star className="w-4 h-4" /> <span className="text-sm font-bold uppercase tracking-wider">Rating</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">{driver.rating}</span>
                <span className="text-sm text-gray-400">/ 5.0</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">{driver.reviews} Total Reviews</p>
            </motion.div>
            
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <MapPin className="w-4 h-4" /> <span className="text-sm font-bold uppercase tracking-wider">Total Trips</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900">{driver.totalTrips}</span>
              </div>
              <p className="text-xs text-green-600 mt-2 font-bold">+12 this week</p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Activity className="w-4 h-4" /> <span className="text-sm font-bold uppercase tracking-wider">Performance</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-gray-900">{driver.performance}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">{driver.experience} Experience</p>
            </motion.div>
          </div>

          {/* Recent Reviews Summary */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" /> Recent Reviews
            </h3>
            <div className="space-y-4">
              {([] as any[]).map((review, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-gray-900">{review.name}</span>
                    <span className="text-xs font-bold text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-black fill-black' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => alert('Loading all reviews...')}
              className="w-full mt-4 py-3 bg-white border-2 border-gray-100 text-gray-900 text-sm font-bold rounded-xl hover:border-black transition-colors"
            >
              View All Reviews
            </button>
          </motion.div>

        </div>
      </div>
      
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-extrabold text-gray-900">Edit Profile</h3>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={driver.name}
                    onChange={(e) => setDriver({...driver, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={driver.contact}
                    onChange={(e) => setDriver({...driver, contact: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={driver.email}
                    onChange={(e) => setDriver({...driver, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                    required
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-black hover:bg-gray-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
