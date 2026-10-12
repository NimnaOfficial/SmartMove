import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useOutlet, useNavigate } from 'react-router-dom';
import { 
  Home, Map, User, Bell, LogOut, Hexagon, Key, Lock, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import authService from '@/services/authService';

const navLinks = [
  { name: 'Dashboard', icon: Home, path: '/driver/dashboard' },
  { name: 'My Trips', icon: Map, path: '/driver/trips' },
  { name: 'Notifications', icon: Bell, path: '/driver/notifications' },
  { name: 'Profile', icon: User, path: '/driver/profile' },
];

export default function DriverLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    if (user && user.mustChangePassword) {
      setShowPasswordModal(true);
    }
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsUpdating(true);
    try {
      await authService.changePassword(newPassword);
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9fafc] text-gray-900 font-sans selection:bg-black selection:text-white flex overflow-hidden">
      
      {/* Sidebar - Dark Rounded Pill */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-24 bg-[#0a0a0b] m-4 md:m-6 rounded-[2.5rem] flex flex-col items-center py-10 shadow-2xl relative z-20 flex-shrink-0 justify-between hidden md:flex"
      >
        <div className="flex flex-col items-center gap-10 w-full">
          {/* Logo */}
          <Link to="/" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
            <Hexagon className="w-6 h-6 text-black fill-black" />
          </Link>

          {/* Nav Links */}
          <div className="flex flex-col gap-6 w-full items-center mt-4">
            {navLinks.map((link) => {
               const isActive = location.pathname.startsWith(link.path);
               return (
                 <Link 
                   key={link.name} 
                   to={link.path}
                   className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group ${isActive ? 'text-black bg-white' : 'text-gray-400 hover:text-white'}`}
                   title={link.name}
                 >
                   <link.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'group-hover:scale-110 transition-transform'}`} />
                 </Link>
               );
            })}
          </div>
        </div>

        <button 
          onClick={() => {
            authService.logout();
            navigate('/login');
          }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Main Canvas */}
      <div className="flex-1 h-screen overflow-y-auto custom-scrollbar p-6 md:p-8 md:pl-2 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full max-w-[1400px] mx-auto bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 overflow-hidden relative border border-gray-100 flex flex-col"
          >
            {/* Mobile Header (Shows only on small screens) */}
            <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-gray-100 flex-shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                   <Hexagon className="w-5 h-5 text-white fill-white" />
                 </div>
                 <span className="font-bold text-xl">Driver</span>
               </div>
               <div className="flex gap-4">
                 <Link to="/driver/notifications" className="text-gray-400 hover:text-black">
                   <Bell className="w-6 h-6" />
                 </Link>
                 <Link to="/driver/profile" className="text-gray-400 hover:text-black">
                   <User className="w-6 h-6" />
                 </Link>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20 md:pb-0">
              {outlet}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-4 z-50">
         {navLinks.map((link) => {
           const isActive = location.pathname.startsWith(link.path);
           return (
             <Link key={link.name} to={link.path} className={`flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
               <link.icon className={`w-6 h-6 ${isActive ? 'fill-black/10' : ''}`} />
             </Link>
           );
         })}
      </div>

      {/* First-Login Change Temporary Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 text-gray-900 relative"
            >
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <Key className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold tracking-tight">Set Your Permanent Password</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Welcome to SmartMove! You signed in using the static temporary password (<code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-800">Driver@123</code>). Please establish your new private password below.
              </p>

              {passwordSuccess ? (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Password updated successfully! Welcome aboard.</span>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="Repeat your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-black transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Change Later
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-md disabled:opacity-50"
                    >
                      {isUpdating ? 'Saving...' : 'Set Password'}
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
