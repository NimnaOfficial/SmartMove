import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f9fafc] flex flex-col items-center justify-center p-4 selection:bg-black selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center"
      >
        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Compass className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 font-medium mb-8">
          The requested page was not found. It might have been moved or doesn't exist.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          Return to Home
        </button>
      </motion.div>
    </div>
  );
}
