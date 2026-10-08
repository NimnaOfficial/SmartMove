import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

export default function SessionExpired() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9fafc] flex flex-col items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center"
      >
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Session Expired</h2>
        <p className="text-gray-500 font-medium mb-8">
          Your session has expired due to inactivity. Please log in again to continue working.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Log In Again
        </button>
      </motion.div>
    </div>
  );
}
