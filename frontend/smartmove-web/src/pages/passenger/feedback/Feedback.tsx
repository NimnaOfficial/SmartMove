import { useState, useEffect } from 'react';
import feedbackService from '@/services/feedbackService';
import authService from '@/services/authService';
import bookingService from '@/services/bookingService';
import tripService from '@/services/tripService';
import contentService from '@/services/contentService';
import { motion } from 'framer-motion';
import { Star, MessageSquare, MapPin, Send, RotateCcw, Clock, Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

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

  // Optional Review Image Attachments (up to 3 files, <= 5MB)
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);

  const [previousFeedback, setPreviousFeedback] = useState<any[]>([]);

  const fetchFeedback = async () => {
    try {
      const user = authService.getCurrentUser();
      const passengerId = (user as any)?.passengerId || user?.userId || user?.id;
      if (!passengerId) {
        setPreviousFeedback([]);
        return;
      }
      const data = await feedbackService.getByPassenger(passengerId);
      setPreviousFeedback(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch feedback', e);
      setPreviousFeedback([]);
    }
  };

  const loadTrips = async () => {
    try {
      const user = authService.getCurrentUser();
      const passengerId = (user as any)?.passengerId || user?.userId || user?.id;
      if (!passengerId) {
        setAvailableTrips([]);
        return;
      }

      const bookings = await bookingService.getMyBookings(passengerId);
      const allTrips = await tripService.getAll();

      const tripMetaMap = new Map<number, any>();
      if (Array.isArray(allTrips)) {
        allTrips.forEach((t: any) => {
          tripMetaMap.set(t.tripId, t);
        });
      }

      const trips: any[] = [];
      const seenTripIds = new Set<number>();

      if (Array.isArray(bookings)) {
        bookings.forEach((b: any) => {
          const status = (b.status || '').toUpperCase();
          if (b.tripId && status !== 'CANCELLED' && !seenTripIds.has(b.tripId)) {
            seenTripIds.add(b.tripId);
            const meta = tripMetaMap.get(b.tripId);
            trips.push({
              tripId: b.tripId,
              routeId: b.routeId || meta?.routeId || 1,
              vehicleId: b.vehicleId || meta?.vehicleId || 1,
              route: b.route || meta?.route || `${meta?.origin || b.origin || 'Terminal'} -> ${meta?.destination || b.destination || 'Station'}`,
              vehicle: b.vehicle || meta?.vehicle || 'Volvo 9900 Coach',
              driverName: b.driverName || meta?.driverName || 'Designated Driver',
              date: b.date || b.bookingDate || meta?.departureDate || 'Completed Trip',
              status: b.status,
            });
          }
        });
      }

      setAvailableTrips(trips);
    } catch (e) {
      console.error('Failed to load trips from travel history', e);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Check total attachments limit
    if (attachments.length + files.length > 3) {
      setStatusMessage({ type: 'error', text: 'You can attach a maximum of 3 photos to your review.' });
      return;
    }

    const newValidFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setStatusMessage({ type: 'error', text: `"${file.name}" exceeds the 5MB size limit.` });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setStatusMessage({ type: 'error', text: `"${file.name}" has an unsupported format. Please use JPEG, PNG, or WebP.` });
        return;
      }
      newValidFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setAttachments(prev => [...prev, ...newValidFiles]);
    setAttachmentPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    setAttachmentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setSelectedTripId('');
    setSelectedTrip(null);
    setRating(0);
    setComment('');
    setAttachments([]);
    setAttachmentPreviews([]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMessage(null);

    if (availableTrips.length === 0) {
      setStatusMessage({ type: 'error', text: 'You can only submit feedback for trips that are in your travel history. No completed trips found.' });
      return;
    }
    if (!selectedTripId) {
      setStatusMessage({ type: 'error', text: 'Please select a trip from your travel history before submitting feedback.' });
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
      const passengerId = (user as any)?.passengerId || user?.userId || user?.id;
      if (!passengerId) {
        setStatusMessage({ type: 'error', text: 'You must be logged in as a passenger to submit feedback.' });
        return;
      }
      const passengerName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Passenger';

      // 1. Submit to Oracle feedback-service (Relational Transaction)
      await feedbackService.submit({
        passengerId,
        tripId: Number(selectedTripId),
        rating,
        comment: comment.trim(),
        description: comment.trim(),
        type: rating >= 4 ? 'APPRECIATION' : rating <= 2 ? 'COMPLAINT' : 'SUGGESTION'
      } as any);

      // 2. Submit to MongoDB reviews collection (Schema-flexible Document)
      let createdReview: any = null;
      try {
        createdReview = await contentService.submitReview({
          passengerId,
          passengerName,
          routeId: selectedTrip?.routeId || 1,
          vehicleId: selectedTrip?.vehicleId || 1,
          driverId: selectedTrip?.driverId || 1,
          rating,
          comment: comment.trim(),
          type: rating <= 2 ? 'COMPLAINT' : 'REVIEW',
          tags: [selectedTrip?.route || 'Transit'],
          createdAt: new Date().toISOString()
        });
      } catch (mongoErr) {
        console.warn('MongoDB review synchronization notice:', mongoErr);
      }

      // 3. Upload review attachments if provided
      if (createdReview && (createdReview.id || createdReview._id) && attachments.length > 0) {
        const reviewId = String(createdReview.id || createdReview._id);
        for (const file of attachments) {
          try {
            await contentService.uploadReviewAttachment(reviewId, file);
          } catch (attErr) {
            console.warn('Failed to upload review attachment:', attErr);
          }
        }
      }

      setStatusMessage({ type: 'success', text: 'Thank you! Your feedback and review have been submitted successfully.' });
      handleReset();
      await fetchFeedback();
    } catch (e: any) {
      console.error('Failed to submit feedback', e);
      const errMsg = e.response?.data?.message || 'Failed to submit feedback. You can only submit feedback for trips in your travel history.';
      setStatusMessage({ type: 'error', text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-8 w-full pb-10">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Feedback & Reviews</h1>
        <p className="text-gray-500 mt-2 font-medium">Share your travel experience, rate your trip, and optionally attach photos of your journey.</p>
      </motion.div>

      {/* Submission Form */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Submit New Trip Review</h2>
        </div>

        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Select Trip (From Travel History)</label>
              <select
                value={selectedTripId}
                disabled={availableTrips.length === 0}
                onChange={(e) => handleTripChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{availableTrips.length === 0 ? 'No booked trips in your travel history' : 'Choose a trip from your history...'}</option>
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
              placeholder="Tell us about your trip experience, bus cleanliness, or punctuality..." 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none resize-none"
            ></textarea>
          </div>

          {/* Optional Review Image Attachments */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" />
                Optional Photo Attachments (Max 3 images, &le; 5MB each)
              </label>
              <span className="text-xs text-gray-400 font-medium">JPEG, PNG, WebP</span>
            </div>

            {/* Thumbnail preview list */}
            {attachmentPreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-2">
                {attachmentPreviews.map((previewUrl, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                    <img src={previewUrl} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {attachments.length < 3 && (
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/30 rounded-2xl cursor-pointer transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-semibold text-gray-600">Click to attach photos of your travel</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
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
              className="flex items-center gap-2 bg-[#1e3f7a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#152e5e] transition-colors shadow-md hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Previous Feedback List */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 mt-4">
        <motion.h3 variants={fadeUp} className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" /> Previous Feedback & Reviews
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
