import { useState, useEffect } from 'react';
import feedbackService from '@/services/feedbackService';
import authService from '@/services/authService';
import bookingService from '@/services/bookingService';
import tripService from '@/services/tripService';
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
  const [comment, setComment] = useState('');
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [availableTrips, setAvailableTrips] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [previousFeedback, setPreviousFeedback] = useState<any[]>([]);

  const fetchFeedback = async () => {
    try {
      const user = authService.getCurrentUser();
      const passengerId = (user as any)?.passengerId || user?.userId || user?.id || 1;
      const data = await feedbackService.getByPassenger(passengerId);
      setPreviousFeedback(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch feedback', e);
    }
  };

  const loadTrips = async () => {
    try {
      const user = authService.getCurrentUser();
      const passengerId = (user as any)?.passengerId || user?.userId || user?.id || 1;

      // First fetch passenger's recent bookings
      const bookings = await bookingService.getMyBookings(passengerId);
      const allTrips = await tripService.getAll();

      const tripMap = new Map<number, any>();

      // Populate from all trips
      if (Array.isArray(allTrips)) {
        allTrips.forEach((t: any) => {
          tripMap.set(t.tripId, {
            tripId: t.tripId,
            route: t.route || `${t.origin} -> ${t.destination}`,
            vehicle: t.vehicle || 'Volvo 9900 (ND-4521)',
            driverName: t.driverName || 'Saman Kumara',
            date: t.date || (t.departureDate ? t.departureDate : 'Recent'),
          });
        });
      }

      // Merge with passenger's booked trips if available
      if (Array.isArray(bookings)) {
        bookings.forEach((b: any) => {
          if (b.tripId) {
            const existing = tripMap.get(b.tripId);
            tripMap.set(b.tripId, {
              tripId: b.tripId,
              route: b.route || existing?.route || 'Colombo -> Kandy',
              vehicle: b.vehicle || existing?.vehicle || 'Volvo 9900 (ND-4521)',
              driverName: existing?.driverName || 'Saman Kumara',
              date: b.date || existing?.date || 'Recent',
            });
          }
        });
      }

      setAvailableTrips(Array.from(tripMap.values()));
    } catch (e) {
      console.error('Failed to load trips', e);
    }
  };

  useEffect(() => {
    fetchFeedback();
    loadTrips();
  }, []);

  const handleTripChange = (tripIdStr: string) => {
    setSelectedTripId(tripIdStr);
    if (!tripIdStr) {
      setSelectedTrip(null);
      return;
    }
    const found = availableTrips.find((t) => String(t.tripId) === tripIdStr);
    setSelectedTrip(found || null);
  };

  const handleReset = () => {
    setSelectedTripId('');
    setSelectedTrip(null);
    setRating(0);
    setComment('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMessage(null);

    if (!selectedTripId) {
      setStatusMessage({ type: 'error', text: 'Please select a trip before submitting feedback.' });
      return;
    }
    if (rating === 0) {
      setStatusMessage({ type: 'error', text: 'Please select a star rating (1 to 5 stars).' });
      return;
    }
    if (!comment.trim()) {
      setStatusMessage({ type: 'error', text: 'Please share a comment about your experience.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const user = authService.getCurrentUser();
      const passengerId = (user as any)?.passengerId || user?.userId || user?.id || 1;

      await feedbackService.submit({
        passengerId,
        tripId: Number(selectedTripId),
        rating,
        comment: comment.trim(),
        description: comment.trim(),
        type: rating >= 4 ? 'APPRECIATION' : rating <= 2 ? 'COMPLAINT' : 'SUGGESTION'
      } as any);

      setStatusMessage({ type: 'success', text: 'Thank you! Your feedback has been submitted successfully.' });
      handleReset();
      await fetchFeedback();
    } catch (e) {
      console.error('Failed to submit feedback', e);
      setStatusMessage({ type: 'error', text: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
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

        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Trip</label>
              <select
                value={selectedTripId}
                onChange={(e) => handleTripChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
              >
                <option value="">Choose a recent trip...</option>
                {availableTrips.map((t) => (
                  <option key={t.tripId} value={t.tripId}>
                    T-{t.tripId}: {t.route} ({t.date})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Route</label>
              <input
                type="text"
                disabled
                value={selectedTrip?.route || ''}
                placeholder="Auto-filled based on trip"
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl block p-3 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Vehicle</label>
              <input
                type="text"
                disabled
                value={selectedTrip?.vehicle || ''}
                placeholder="Auto-filled based on trip"
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl block p-3 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Driver</label>
              <input
                type="text"
                disabled
                value={selectedTrip?.driverName || ''}
                placeholder="Auto-filled based on trip"
                className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-xl block p-3 cursor-not-allowed"
              />
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
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..." 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-[#1e3f7a] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#152e5e] transition-colors shadow-md hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
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
          <motion.div key={fb.id || fb.feedbackId} variants={fadeUp} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
               <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-900">{fb.route || fb.routeName || 'Trip Feedback'}</span>
                 </div>
                 <p className="text-gray-600 italic">"{fb.comment || fb.description}"</p>
               </div>
               <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= (fb.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-400">{fb.date || (fb.createdAt ? fb.createdAt.split('T')[0] : 'Recent')}</span>
               </div>
             </div>
          </motion.div>
        ))}

        {previousFeedback.length === 0 && (
          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 text-center text-gray-500 font-medium">
            No feedback submitted yet.
          </div>
        )}
      </motion.div>
    </div>
  );
}
