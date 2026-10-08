import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Key, Mail, Phone } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully.');
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
          <p className="text-gray-400 mt-2 text-sm font-medium">Manage your system profile, security, and preferences.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'profile' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <User className="w-4 h-4" /> Profile Details
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'security' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Shield className="w-4 h-4" /> Security
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
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-white/10">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                    <input 
                      type="text" 
                      defaultValue="System"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue="Administrator"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="email" 
                        defaultValue="admin@smartmove.lk"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="tel" 
                        defaultValue="+94 11 234 5678"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
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
                <Key className="w-5 h-5 text-blue-400" /> Change Password
              </h2>
              
              <form onSubmit={handleSave} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
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
