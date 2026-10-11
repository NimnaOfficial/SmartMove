import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Key, Mail, Phone, CheckCircle2, Lock } from 'lucide-react';
import authService from '@/services/authService';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [successMsg, setSuccessMsg] = useState('');

  const [profileData, setProfileData] = useState({
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@smartmove.lk',
    phone: '+94 11 234 5678',
    role: 'ADMIN'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setProfileData({
        firstName: user.firstName || 'System',
        lastName: user.lastName || 'Administrator',
        email: user.email || 'admin@smartmove.lk',
        phone: user.phone || '+94 11 234 5678',
        role: user.role || 'ADMIN'
      });
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = authService.getCurrentUser() || {};
    const updatedUser = {
      ...currentUser,
      ...profileData
    };
    localStorage.setItem('smartmove_user', JSON.stringify(updatedUser));
    setSuccessMsg('Profile details saved successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSuccessMsg('Security credentials updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto h-full pb-10">
      
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-purple-400">
              <User className="w-6 h-6" />
            </div>
            Admin Settings
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium">Manage your system profile, security, and administrative preferences.</p>
        </div>

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <User className="w-4 h-4" /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'security' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Shield className="w-4 h-4" /> Security & Passwords
          </button>
        </motion.div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#161721] rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6">Profile Details</h2>
              
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
                  <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop" 
                    alt="Admin" 
                    className="w-full h-full rounded-full border-4 border-[#161721] object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{profileData.firstName} {profileData.lastName}</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {profileData.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">SmartMove Master Operations & Fleet Admin</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="tel" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#161721] rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-400" /> Change Security Password
              </h2>
              
              <form onSubmit={handleSavePassword} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    required
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
