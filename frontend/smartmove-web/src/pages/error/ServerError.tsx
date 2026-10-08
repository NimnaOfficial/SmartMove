import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9fafc] flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center"
      >
        <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">500</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Something went wrong</h2>
        <p className="text-gray-500 font-medium mb-8">
          An unexpected error has occurred on our end. Please try again later.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
