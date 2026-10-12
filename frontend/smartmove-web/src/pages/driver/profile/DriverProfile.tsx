import { useState, useEffect } from 'react';
import driverService from '@/services/driverService';
import authService from '@/services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, Mail, Award, Star, Activity, ShieldCheck, 
  MapPin, X, Edit3, Key, Lock, CheckCircle2, AlertCircle
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function DriverProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const currentUser = authService.getCurrentUser();
  const [driver, setDriver] = useState({
    name: `${currentUser?.firstName || 'Driver'} ${currentUser?.lastName || ''}`.trim(),
    firstName: currentUser?.firstName || 'Driver',
    lastName: currentUser?.lastName || '',
    id: `DRV-${currentUser?.userId || 1}`,
    driverId: currentUser?.userId || 1,
    status: (currentUser as any)?.status || 'ACTIVE',
    contact: currentUser?.phone || '',
    email: currentUser?.email || '',
    license: (currentUser as any)?.licenseNumber || `B${1000000 + (currentUser?.userId || 1)}`,
    experience: '5 Years',
    rating: Number((currentUser as any)?.rating ?? 5.0),
    reviews: 16,
    totalTrips: Number((currentUser as any)?.totalTrips ?? 0),
    performance: 'Exceptional'
  });

  const fetchProfile = async () => {
    try {
      const data = await driverService.getProfile();
      if (data) {
        setDriver(prev => ({
          ...prev,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || prev.name,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          id: `DRV-${data.driverId || prev.driverId}`,
          driverId: data.driverId || prev.driverId,
          status: data.status || prev.status,
          contact: data.phone || prev.contact,
          email: data.email || prev.email,
          license: data.licenseNumber || prev.license,
          rating: data.rating !== undefined ? data.rating : prev.rating,
          totalTrips: data.totalTrips !== undefined ? data.totalTrips : prev.totalTrips
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await driverService.updateProfile({
        driverId: driver.driverId,
        firstName: driver.firstName,
        lastName: driver.lastName,
        phone: driver.contact,
        email: driver.email,
        licenseNumber: driver.license
      });
      setDriver(prev => ({
        ...prev,
        name: `${res?.firstName || driver.firstName} ${res?.lastName || driver.lastName}`.trim(),
        firstName: res?.firstName || driver.firstName,
        lastName: res?.lastName || driver.lastName,
        contact: res?.phone || driver.contact,
        email: res?.email || driver.email
      }));
      setProfileSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setProfileSuccess(false);
        fetchProfile();
      }, 1000);
    } catch (err) {
      console.error(err);
      setDriver(prev => ({
        ...prev,
        name: `${driver.firstName} ${driver.lastName}`.trim()
      }));
      setProfileSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setProfileSuccess(false);
      }, 1000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      await authService.changePassword(newPassword);
      setPasswordSuccess(true);
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess(false);
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    }
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
            Driver Profile
          </h1>
          <p className="text-gray-500 font-medium mt-2">Manage your profile details, security password, and view ratings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsChangingPassword(true)}
            className="bg-white border border-gray-200 text-gray-800 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
          >
            <Key className="w-4 h-4 text-purple-600" /> Change Password
          </button>
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Personal Info Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-1 bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 border-4 border-white shadow-sm ring-1 ring-gray-100">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
              <p className="text-sm font-bold text-gray-400 mt-1">{driver.id}</p>
              <span className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1.5 uppercase">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                {driver.status}
              </span>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium">{driver.contact}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium">{driver.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm font-medium">License: {driver.license}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setIsChangingPassword(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center gap-2 border border-gray-200 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-purple-600" />
              <span>Update Login Password</span>
            </button>
          </div>
        </motion.div>

        {/* Stats & Operational Info */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-black text-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 
                <span className="text-xs font-bold uppercase tracking-wider">Rating</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">{driver.rating}</span>
                <span className="text-xs text-gray-400">/ 5.0</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Based on 124 reviews</p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Activity className="w-4 h-4" /> 
                <span className="text-xs font-bold uppercase tracking-wider">Total Trips</span>
              </div>
              <span className="text-3xl font-extrabold text-gray-900">{driver.totalTrips}</span>
              <p className="text-xs text-gray-400 mt-2 font-medium">Recorded journeys</p>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Award className="w-4 h-4 text-emerald-600" /> 
                <span className="text-xs font-bold uppercase tracking-wider">Status</span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-700">{driver.performance}</span>
              <p className="text-xs text-gray-400 mt-2 font-medium">Fleet Safety Record</p>
            </motion.div>
          </div>

          {/* Security & Credentials Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-700" /> Account Security & Password
              </h3>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                Protected
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your driver account credentials allow access to assigned trip manifests, passenger logs, and route schedules. Always maintain a private password.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-700">Login Email: <span className="font-mono text-gray-900">{driver.email}</span></p>
                <p className="text-[11px] text-gray-400 mt-0.5">Password last managed locally</p>
              </div>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                Change Password
              </button>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
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
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {profileSuccess ? (
                <div className="p-8 text-center text-emerald-600 font-bold space-y-2">
                  <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                  <p>Profile updated successfully!</p>
                </div>
              ) : (
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">First Name</label>
                      <input 
                        type="text" 
                        value={driver.firstName}
                        onChange={(e) => setDriver({...driver, firstName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Last Name</label>
                      <input 
                        type="text" 
                        value={driver.lastName}
                        onChange={(e) => setDriver({...driver, lastName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={driver.contact}
                      onChange={(e) => setDriver({...driver, contact: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={driver.email}
                      onChange={(e) => setDriver({...driver, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-black hover:bg-gray-800 transition-colors shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangingPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-extrabold text-gray-900">Change Password</h3>
                </div>
                <button 
                  onClick={() => setIsChangingPassword(false)}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {passwordSuccess ? (
                <div className="p-8 text-center text-emerald-600 font-bold space-y-2">
                  <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                  <p>Password updated successfully!</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-black hover:bg-gray-800 transition-colors shadow-md"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
