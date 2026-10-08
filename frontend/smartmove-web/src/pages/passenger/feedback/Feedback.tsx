import { useState, useEffect } from 'react';
import feedbackService from '@/services/feedbackService';
import authService from '@/services/authService';
import { motion } from 'framer-motion';
import { Star, MessageSquare, MapPin, Send, RotateCcw, Clock } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [previousFeedback, setPreviousFeedback] = useState<any[]>([]);
  const [formData, setFormData] = useState({ routeId: '', comment: '' });
  
  const fetchFeedback = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user?.id) {
         const data = await feedbackService.getByPassenger(user.id);
         setPreviousFeedback(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => {
    fetchFeedback();
  }, []);
  
  const handleSubmit = async () => {
     try {
       await feedbackService.submit({ ...formData, rating, type: 'FEEDBACK' } as any);
       fetchFeedback();
       setFormData({ routeId: '', comment: '' });
       setRating(0);
     } catch (e) {
       console.error(e);
     }
  };


  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-8 w-full pb-10">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Feedback & Reviews</h1>
        <p className="text-gray-500 mt-2 font-light">Share your travel experience to help us improve our services.</p>
      </motion.div>

      {/* Submission Form */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Submit New Feedback</h2>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Trip</label>
              <select className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none">
                <option value="">Choose a recent trip...</option>
                <option value="T-1042">T-1042: Colombo - Kandy (Oct 15, 2026)</option>
                <option value="T-1045">T-1045: Galle - Matara (Oct 12, 2026)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Route</label>
              <input type="text" disabled placeholder="Auto-filled based on trip" className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl block p-3 cursor-not-allowed" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Vehicle</label>
              <input type="text" disabled placeholder="Auto-filled based on trip" className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl block p-3 cursor-not-allowed" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Driver</label>
              <input type="text" disabled placeholder="Auto-filled based on trip" className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl block p-3 cursor-not-allowed" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Rating (1-5)</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-gray-500">
                {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Comment</label>
            <textarea 
              rows={4} 
              placeholder="Tell us about your experience..." 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button type="button" className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button type="button" className="flex items-center gap-2 bg-[#1e3f7a] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#152e5e] transition-colors shadow-md hover:-translate-y-0.5">
              <Send className="w-4 h-4" /> Submit Feedback
            </button>
          </div>
        </form>
      </motion.div>

      {/* Previous Feedback List */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 mt-4">
        <motion.h3 variants={fadeUp} className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" /> Previous Feedback
        </motion.h3>

        {previousFeedback.map((fb) => (
          <motion.div key={fb.id} variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
               <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-900">{fb.route}</span>
                 </div>
                 <p className="text-gray-600 italic">"{fb.comment}"</p>
               </div>
               <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-400">{fb.date}</span>
               </div>
             </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
