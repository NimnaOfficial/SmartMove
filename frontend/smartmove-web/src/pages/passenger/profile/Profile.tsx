import { useState, useEffect } from 'react';
import passengerService from '@/services/passengerService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, Key, 
  CheckCircle2, AlertCircle, Save
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [profileData, setProfileData] = useState<any>({
    firstName: 'Dipak',
    lastName: 'Palve',
    email: 'dipak.palve@example.com',
    phone: '+94 77 123 4567',
    address: '123 Coastal Road',
    city: 'Colombo',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await passengerService.getProfile();
        if (data) setProfileData((prev: any) => ({ ...prev, ...data }));
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

    const handleSave = async () => {
    try {
      await passengerService.updateProfile(profileData);
      setIsEditing(false);
      setIsChangingPassword(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch(e) { console.error(e); }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col w-full pb-10 overflow-y-auto custom-scrollbar pr-2 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 font-medium"
          >
            <CheckCircle2 className="w-5 h-5" />
            Changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#1e3f7a]">
              <User className="w-6 h-6" />
            </div>
            Profile
          </h1>
          <p className="text-gray-500 mt-2 font-light max-w-lg">
            Manage your personal information, contact details, and account security.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 rounded-xl bg-gray-50 text-[#1e3f7a] text-sm font-semibold hover:bg-blue-50 border border-gray-200 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-xl bg-gray-50 text-gray-600 text-sm font-semibold hover:bg-gray-100 border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-[#1e3f7a] text-white text-sm font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </>
          )}
        </div>
      </motion.div>

      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        animate="visible"
        className="space-y-8"
      >
        {/* Profile Identity Card */}
        <motion.div variants={fadeUp} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h2>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-1.5">
              <span className="bg-blue-50 text-[#1e3f7a] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Premium Passenger
              </span>
              <span className="text-sm text-gray-500 font-medium">Joined Jan 2026</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <motion.div variants={fadeUp} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="space-y-5 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 disabled:opacity-70 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 disabled:opacity-70 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={fadeUp} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
            </div>
            
            <div className="space-y-5 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  disabled={!isEditing}
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 disabled:opacity-70 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  disabled={!isEditing}
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 disabled:opacity-70 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 disabled:opacity-70 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Account Security */}
        <motion.div variants={fadeUp} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Account Security</h3>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-500">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Password</h4>
                <p className="text-sm text-gray-500">Last changed 3 months ago</p>
              </div>
            </div>
            
            {!isChangingPassword ? (
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="px-6 py-2.5 rounded-xl bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 border border-gray-200 transition-colors shadow-sm"
              >
                Change Password
              </button>
            ) : (
              <button 
                onClick={() => setIsChangingPassword(false)}
                className="px-6 py-2.5 rounded-xl bg-white text-gray-600 text-sm font-semibold hover:bg-gray-100 border border-gray-200 transition-colors shadow-sm"
              >
                Cancel Change
              </button>
            )}
          </div>

          <AnimatePresence>
            {isChangingPassword && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3f7a] focus:border-transparent transition-all"
                      />
                      <button 
                        onClick={handleSave}
                        className="px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              For your security, we recommend using a strong, unique password that you do not use for any other accounts.
            </p>
          </div>
        </motion.div>



      </motion.div>
    </div>
  );
}
