import { useState, useEffect } from 'react';
import tripService from '@/services/tripService';
import driverService from '@/services/driverService';
import bookingService from '@/services/bookingService';
import contentService from '@/services/contentService';
import authService from '@/services/authService';
import { MediaItem, VehicleImage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Clock, Calendar, Car, ShieldCheck, 
  AlertTriangle, Navigation, Users, CheckCircle2, Phone, X, Send,
  Camera, Upload, ImageIcon, Trash2, Eye, FileText, CheckCircle, AlertCircle, ExternalLink
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function TripDetails() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState<any>(null);
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = useState('SCHEDULED');
  const [manifestBookings, setManifestBookings] = useState<any[]>([]);
  const [showManifest, setShowManifest] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [issueCategory, setIssueCategory] = useState<'traffic' | 'mechanical' | 'medical' | 'other'>('traffic');
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  // ─── Evidence & Media State ──────────────────────────────────────────
  const [tripMedia, setTripMedia] = useState<MediaItem[]>([]);
  const [assignedVehicleImages, setAssignedVehicleImages] = useState<VehicleImage[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | null>(null);
  const [evidenceCategory, setEvidenceCategory] = useState<'PRE_TRIP_INSPECTION' | 'POST_TRIP_INSPECTION' | 'INCIDENT' | 'VEHICLE_CONDITION' | 'PHOTO'>('PRE_TRIP_INSPECTION');
  const [evidenceCaption, setEvidenceCaption] = useState('');
  const [evidenceIsPublic, setEvidenceIsPublic] = useState(false);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [evidenceError, setEvidenceError] = useState('');
  const [previewLightbox, setPreviewLightbox] = useState<{ url: string; title: string; subtitle?: string; isPdf?: boolean } | null>(null);

  const rawId = tripId ? Number(tripId.replace(/\D/g, '')) : 1001;
  const currentUser = authService.getCurrentUser();

  const fetchMedia = async (vehicleId?: number) => {
    try {
      setLoadingMedia(true);
      const media = await contentService.getTripMediaItems(rawId);
      setTripMedia(Array.isArray(media) ? media : []);

      const vId = vehicleId || tripData?.vehicleId;
      if (vId) {
        try {
          const vImages = await contentService.getVehicleImages(Number(vId));
          setAssignedVehicleImages(Array.isArray(vImages) ? vImages : []);
        } catch (vErr) {
          console.warn('Vehicle images fetch warning:', vErr);
        }
      }
    } catch (err) {
      console.error('Failed to load trip media:', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const fetchTrip = async () => {
    try {
      if (tripId) {
        const data = await tripService.getById(rawId);
        if (data) {
          setTripData(data);
          setTripStatus((data.status || 'SCHEDULED').toUpperCase());
          fetchMedia(data.vehicleId);
        }
        try {
          const bks = await bookingService.getByTrip(rawId);
          setManifestBookings(Array.isArray(bks) ? bks : []);
        } catch {}
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId, rawId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvidenceError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setEvidenceError('File exceeds maximum size of 5MB');
        return;
      }
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowed.includes(file.type)) {
        setEvidenceError('Unsupported format. Please select JPEG, PNG, WebP, or PDF.');
        return;
      }
      setEvidenceFile(file);
      if (file.type.startsWith('image/')) {
        setEvidencePreviewUrl(URL.createObjectURL(file));
      } else {
        setEvidencePreviewUrl(null);
      }
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceFile) {
      setEvidenceError('Please select a photo or document first.');
      return;
    }
    try {
      setUploadingEvidence(true);
      setEvidenceError('');
      await contentService.uploadDriverTripEvidence(
        rawId,
        evidenceFile,
        evidenceCategory,
        evidenceCaption || `${evidenceCategory.replace(/_/g, ' ')} submitted by Driver`,
        evidenceIsPublic
      );
      // Clean up preview
      if (evidencePreviewUrl) {
        URL.revokeObjectURL(evidencePreviewUrl);
      }
      setEvidenceFile(null);
      setEvidencePreviewUrl(null);
      setEvidenceCaption('');
      setEvidenceIsPublic(false);
      setShowEvidenceModal(false);
      await fetchMedia();
    } catch (err: any) {
      console.error('Evidence upload error:', err);
      setEvidenceError(err.response?.data?.message || err.response?.data || 'Failed to upload evidence');
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleDeleteEvidence = async (mediaId: string) => {
    if (!window.confirm('Are you sure you want to delete this evidence record?')) return;
    try {
      await contentService.deleteTripMedia(mediaId);
      setTripMedia(prev => prev.filter(m => m.id !== mediaId && (m as any)._id !== mediaId));
    } catch (err: any) {
      console.error('Failed to delete media:', err);
      alert(err.response?.data?.message || err.response?.data || 'Failed to delete evidence file');
    }
  };

  const bookedCount = manifestBookings.length > 0 
    ? manifestBookings.reduce((sum, b) => sum + Number(b.seatsBooked || b.seats || 1), 0)
    : (tripData?.availableSeats ? (tripData.totalSeats || 45) - tripData.availableSeats : 0);

  const trip = {
    id: `TRP-${tripData?.tripId || rawId}`,
    route: `${tripData?.routeOrigin || 'Colombo'} ➔ ${tripData?.routeDestination || 'Galle'}`,
    from: tripData?.routeOrigin || 'Colombo Fort',
    to: tripData?.routeDestination || 'Galle Bus Stand',
    date: tripData?.departureTime ? new Date(tripData.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
    departure: tripData?.departureTime ? new Date(tripData.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 AM',
    arrival: tripData?.arrivalTime ? new Date(tripData.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:00 AM',
    vehicle: {
      number: tripData?.vehicleRegistration || 'WP-ND-4521',
      model: tripData?.vehicleModel || tripData?.vehicleType || 'Volvo 9900 Luxury Coach',
      capacity: tripData?.totalSeats || 45,
      maintenance: 'Cleared & Inspected'
    },
    passengers: bookedCount,
    status: tripStatus,
    isPaid: (tripData as any)?.isPaid !== false && (tripData as any)?.paymentStatus !== 'UNPAID',
    paymentStatus: (tripData as any)?.paymentStatus || 'PAID'
  };

  const handleAcceptTrip = async () => {
    try {
      setTripStatus('CONFIRMED');
      await driverService.acceptTrip(rawId);
      await fetchTrip();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await driverService.updateTripStatus(rawId, newStatus);
      setTripStatus(newStatus);
      await fetchTrip();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.response?.data || 'Failed to update trip status');
    }
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;

    setIssueSubmitted(true);
    setTimeout(() => {
      setShowIssueModal(false);
      setIssueSubmitted(false);
      setIssueText('');
    }, 1500);
  };

  const passengerManifest = [
    { seat: '01A', name: 'Kasun Jayawardena', phone: '+94 70 987 6543', status: 'Boarded' },
    { seat: '02B', name: 'Elena Rostova', phone: '+94 72 876 5432', status: 'Boarded' },
    { seat: '05A', name: 'Nalaka Bandara', phone: '+94 77 345 6789', status: 'Boarded' },
    { seat: '08C', name: 'Sanduni Fernando', phone: '+94 71 223 3445', status: 'Reserved' },
    { seat: '12A', name: 'Ruwan Wijesinghe', phone: '+94 76 554 4332', status: 'Boarded' },
    { seat: '14B', name: 'Priya Sharma', phone: '+94 77 889 9001', status: 'Boarded' },
    { seat: '16A', name: 'Dinuka Perera', phone: '+94 75 443 2211', status: 'Reserved' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto h-full pb-10">
      
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/driver/trips')}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            Trip Details
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              tripStatus === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
              tripStatus === 'IN_PROGRESS' ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
              'bg-black text-white'
            }`}>
              {tripStatus}
            </span>
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">{trip.id} • {trip.route}</p>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Route & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5" /> Route & Schedule
            </h3>
            
            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {/* Departure */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-2.4rem] w-8 h-8 rounded-full bg-black flex items-center justify-center text-white ring-4 ring-white z-10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Origin Terminal</span>
                  <p className="font-bold text-gray-900 text-base">{trip.from}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Departure: {trip.departure} ({trip.date})
                  </p>
                </div>
              </div>

              {/* Arrival */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-2.4rem] w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white ring-4 ring-white z-10">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Destination</span>
                  <p className="font-bold text-gray-900 text-base">{trip.to}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Expected Arrival: {trip.arrival}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-gray-900">Trip Controls</h3>
               {tripStatus !== 'COMPLETED' && (
                 <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${
                   trip.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                 }`}>
                   {trip.isPaid ? 'Card Paid' : 'Card Payment Pending'}
                 </span>
               )}
             </div>

             {tripStatus === 'IN_PROGRESS' && !trip.isPaid && (
               <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                 <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                 <span>Passenger card payment is pending. This trip cannot be completed until the passenger completes payment by card.</span>
               </div>
             )}

             <div className="flex flex-wrap gap-3">
               {tripStatus === 'PENDING' && (
                 <button 
                   onClick={() => handleAcceptTrip()}
                   className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                 >
                   <CheckCircle2 className="w-4 h-4" /> Accept Schedule
                 </button>
               )}
               <button 
                 onClick={() => handleUpdateStatus('IN_PROGRESS')}
                 disabled={tripStatus === 'IN_PROGRESS' || tripStatus === 'COMPLETED' || tripStatus === 'PENDING'}
                 className="flex-1 bg-black text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
               >
                 Start Journey
               </button>
               <button 
                 onClick={() => handleUpdateStatus('COMPLETED')}
                 disabled={tripStatus !== 'IN_PROGRESS' || !trip.isPaid}
                 title={!trip.isPaid ? "Passenger card payment is pending" : "Complete Trip"}
                 className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md"
               >
                 {tripStatus === 'IN_PROGRESS' && !trip.isPaid ? 'Awaiting Card Payment' : 'Complete Trip'}
               </button>
               <button 
                 onClick={() => setShowIssueModal(true)}
                 className="flex-none bg-red-50 text-red-600 py-3 px-4 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2 cursor-pointer border border-red-200"
               >
                 <AlertTriangle className="w-4 h-4" /> Report Issue
               </button>
             </div>
          </motion.div>

          {/* Trip Evidence & Operational Media Card */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-gray-800" /> Trip Evidence & Operational Media
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Pre-trip inspection photos, odometer records, and dispatch evidence stored securely in MongoDB
                </p>
              </div>
              <button
                onClick={() => {
                  setEvidenceError('');
                  setShowEvidenceModal(true);
                }}
                className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm whitespace-nowrap self-start sm:self-auto"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Evidence
              </button>
            </div>

            {loadingMedia ? (
              <div className="py-12 text-center text-gray-400 text-xs font-medium">
                Loading trip evidence...
              </div>
            ) : tripMedia.length === 0 ? (
              <div className="p-8 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-800">No Evidence Uploaded Yet</p>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Upload pre-trip or post-trip safety checklist photos, vehicle condition reports, or operational records for this route.
                </p>
                <button
                  onClick={() => setShowEvidenceModal(true)}
                  className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Upload First Record
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tripMedia.map((item) => {
                  const mediaId = item.id || (item as any)._id;
                  const isPdf = Boolean(item.mediaType === 'DOCUMENT' || (item.fileUrl && item.fileUrl.endsWith('.pdf')));
                  const displayUrl = item.fileUrl && !item.fileUrl.startsWith('/api') 
                    ? item.fileUrl 
                    : contentService.getMediaFileUrl(mediaId);
                  const isOwner = (item.driverId && String(item.driverId) === String(currentUser?.userId || currentUser?.id)) || item.uploaderRole === 'DRIVER';
                  
                  return (
                    <div 
                      key={mediaId} 
                      className="bg-gray-50 rounded-2xl p-3 border border-gray-200 flex flex-col justify-between group hover:border-gray-400 transition-all"
                    >
                      <div>
                        {/* Media Thumbnail / Preview */}
                        <div 
                          onClick={() => setPreviewLightbox({
                            url: displayUrl,
                            title: item.title || 'Trip Evidence',
                            subtitle: `${item.category || 'OPERATIONAL'} • Driver Upload`,
                            isPdf
                          })}
                          className="w-full h-36 bg-gray-200 rounded-xl overflow-hidden relative cursor-pointer flex items-center justify-center"
                        >
                          {isPdf ? (
                            <div className="flex flex-col items-center justify-center gap-2 text-red-600 p-4 text-center">
                              <FileText className="w-10 h-10" />
                              <span className="text-xs font-bold text-gray-800 truncate max-w-[150px]">PDF Document</span>
                            </div>
                          ) : (
                            <img 
                              src={displayUrl} 
                              alt={item.title || 'Trip Media'} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="px-2.5 py-1 bg-white/90 text-black text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Inspect
                            </span>
                          </div>
                        </div>

                        {/* Badges & Meta */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            item.category === 'PRE_TRIP_INSPECTION' ? 'bg-blue-100 text-blue-700' :
                            item.category === 'INCIDENT' ? 'bg-red-100 text-red-700' :
                            item.category === 'POST_TRIP_INSPECTION' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {item.category?.replace(/_/g, ' ') || 'EVIDENCE'}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            item.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                            item.approvalStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.approvalStatus === 'APPROVED' ? 'Approved' :
                             item.approvalStatus === 'REJECTED' ? 'Rejected' : 'Under Review'}
                          </span>

                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                            item.isPublic ? 'bg-cyan-50 text-cyan-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.isPublic ? 'Public Photo' : 'Private Dispatch'}
                          </span>
                        </div>

                        <p className="font-bold text-gray-900 text-xs mt-2 line-clamp-1">{item.title}</p>
                        {item.uploadedAt && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {new Date(item.uploadedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="mt-3 pt-2.5 border-t border-gray-200 flex items-center justify-between">
                        <button
                          onClick={() => setPreviewLightbox({
                            url: displayUrl,
                            title: item.title || 'Trip Evidence',
                            subtitle: `${item.category || 'OPERATIONAL'} • Driver Upload`,
                            isPdf
                          })}
                          className="text-xs font-bold text-gray-700 hover:text-black flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>

                        {isOwner && (
                          <button
                            onClick={() => handleDeleteEvidence(mediaId)}
                            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                            title="Delete this evidence record"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Vehicle & Info */}
        <div className="space-y-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5" /> Assigned Vehicle
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registration</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{trip.vehicle.number}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Model</p>
                   <p className="text-xs font-bold text-gray-900 truncate">{trip.vehicle.model}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Capacity</p>
                   <p className="text-sm font-bold text-gray-900">{trip.vehicle.capacity} Seats</p>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold">{trip.vehicle.maintenance}</span>
              </div>

              {/* Assigned Vehicle Verified Photos */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Fleet Unit Photos</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {assignedVehicleImages.length} available
                  </span>
                </p>
                {assignedVehicleImages.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No exterior photos uploaded for this coach</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {assignedVehicleImages.map((img, idx) => {
                      const imgUrl = img.url && !img.url.startsWith('/api') 
                        ? img.url 
                        : (img.id ? contentService.getVehicleDocumentFileUrl(img.id) : img.url);
                      return (
                        <div
                          key={img.id || idx}
                          onClick={() => setPreviewLightbox({
                            url: imgUrl,
                            title: `${trip.vehicle.number} — ${img.caption || 'Coach Inspection Photo'}`,
                            subtitle: `Vehicle #${tripData?.vehicleId || ''} (${trip.vehicle.model})`
                          })}
                          className="h-16 rounded-lg bg-gray-200 overflow-hidden cursor-pointer relative group border border-gray-200"
                        >
                          <img 
                            src={imgUrl} 
                            alt={img.caption || 'Vehicle Photo'} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="bg-black text-white rounded-[1.5rem] p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-300" /> Passenger Manifest
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-extrabold">{trip.passengers}</p>
                <p className="text-gray-400 text-sm font-medium mt-1">Booked Passengers</p>
              </div>
              <button 
                onClick={() => setShowManifest(true)}
                className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                View List
              </button>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Passenger Manifest Modal */}
      <AnimatePresence>
        {showManifest && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Passenger Manifest</h3>
                  <p className="text-xs text-gray-500">{trip.id} • {trip.passengers} passengers booked</p>
                </div>
                <button onClick={() => setShowManifest(false)} className="p-2 text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar my-4 space-y-2">
                {manifestBookings.length > 0 ? (
                  manifestBookings.map((b: any, idx: number) => {
                    const st = (b.bookingStatus || b.status || 'CONFIRMED').toUpperCase();
                    const isCompleted = st === 'COMPLETED';
                    const isPending = st === 'PENDING';
                    const isInProg = st === 'IN_PROGRESS';
                    const seats = b.seatsBooked || b.seats || 1;
                    return (
                      <div key={b.bookingId || idx} className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-black text-white font-bold text-xs flex items-center justify-center">
                            #{b.bookingId || idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{b.passengerName || `Passenger #${b.passengerId}`}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              Seats: {seats} • LKR {Number(b.totalFare || b.amount || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          isCompleted ? 'bg-gray-100 text-gray-700' :
                          isInProg ? 'bg-purple-100 text-purple-800' :
                          isPending ? 'bg-orange-100 text-orange-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {st}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  passengerManifest.map((p, idx) => (
                    <div key={idx} className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-black text-white font-bold text-xs flex items-center justify-center">
                          {p.seat}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {p.phone}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                        p.status === 'Boarded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setShowManifest(false)}
                className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Close Manifest
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Issue & Alert Central Dispatch Modal */}
      <AnimatePresence>
        {showIssueModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900">Report Operational Alert</h3>
                </div>
                <button onClick={() => setShowIssueModal(false)} className="p-2 text-gray-400 hover:text-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {issueSubmitted ? (
                <div className="py-8 text-center text-emerald-600 font-bold space-y-2">
                  <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                  <p>Issue reported successfully!</p>
                </div>
              ) : (
                <form onSubmit={handleReportIssue} className="my-4 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Issue Category</label>
                    <select
                      value={issueCategory}
                      onChange={(e: any) => setIssueCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
                    >
                      <option value="traffic">Traffic Congestion / Reroute</option>
                      <option value="mechanical">Mechanical / Vehicle Breakdown</option>
                      <option value="medical">Medical or Passenger Emergency</option>
                      <option value="other">General Operational Delay</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Details for Dispatch</label>
                    <textarea
                      required
                      rows={3}
                      value={issueText}
                      onChange={(e) => setIssueText(e.target.value)}
                      placeholder="Describe location, condition, or assistance needed..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none resize-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowIssueModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" /> Transmit Alert
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Evidence Modal */}
      <AnimatePresence>
        {showEvidenceModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Upload Trip Evidence</h3>
                    <p className="text-xs text-gray-500">{trip.id} • {trip.route}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowEvidenceModal(false);
                    setEvidenceError('');
                  }} 
                  className="p-2 text-gray-400 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {evidenceError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{evidenceError}</span>
                </div>
              )}

              <form onSubmit={handleUploadEvidence} className="my-4 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    Evidence Category *
                  </label>
                  <select
                    value={evidenceCategory}
                    onChange={(e: any) => setEvidenceCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-black"
                  >
                    <option value="PRE_TRIP_INSPECTION">Pre-Trip Safety & Readiness Inspection</option>
                    <option value="POST_TRIP_INSPECTION">Post-Trip Condition & Handover Report</option>
                    <option value="INCIDENT">Incident / Breakdown / Traffic Obstruction</option>
                    <option value="VEHICLE_CONDITION">Vehicle Cleanliness / Odometer / Maintenance</option>
                    <option value="PHOTO">Route Photography / Scenic Landmark</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    Attach Evidence File * (Max 5MB)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-gray-400 transition-colors bg-gray-50/50">
                    <input
                      type="file"
                      id="evidenceFileInput"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label 
                      htmlFor="evidenceFileInput" 
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      {evidencePreviewUrl ? (
                        <div className="relative group w-full">
                          <img 
                            src={evidencePreviewUrl} 
                            alt="Evidence preview" 
                            className="h-40 mx-auto rounded-xl object-contain border border-gray-200" 
                          />
                          <p className="text-xs font-bold text-gray-600 mt-2">
                            {evidenceFile?.name} ({(evidenceFile!.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                          <span className="text-[11px] text-blue-600 underline">Click to choose another</span>
                        </div>
                      ) : evidenceFile ? (
                        <div className="flex flex-col items-center gap-2 text-red-600 py-4">
                          <FileText className="w-12 h-12" />
                          <p className="text-xs font-bold text-gray-800">
                            {evidenceFile.name} ({(evidenceFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                          <span className="text-[11px] text-blue-600 underline">Click to choose another</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-500">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-gray-800">
                            Click to select photo or document
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Supports JPEG, PNG, WebP, and PDF up to 5MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    Description / Operational Notes
                  </label>
                  <input
                    type="text"
                    value={evidenceCaption}
                    onChange={(e) => setEvidenceCaption(e.target.value)}
                    placeholder="e.g. Tyres and brake fluid inspected; clean interior."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="evidenceIsPublicCheckbox"
                    checked={evidenceIsPublic}
                    onChange={(e) => setEvidenceIsPublic(e.target.checked)}
                    className="mt-0.5 rounded text-black focus:ring-black cursor-pointer"
                  />
                  <label htmlFor="evidenceIsPublicCheckbox" className="text-xs text-gray-700 cursor-pointer select-none">
                    <span className="font-bold block text-gray-900">Allow Passenger Public Viewing</span>
                    If checked, this photo may appear in passenger route galleries once approved by dispatch. Unchecked items stay internal to operational staff.
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEvidenceModal(false);
                      setEvidenceError('');
                    }}
                    disabled={uploadingEvidence}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingEvidence || !evidenceFile}
                    className="flex-1 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    {uploadingEvidence ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading to MongoDB...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" /> Submit Evidence
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox / Preview Modal */}
      <AnimatePresence>
        {previewLightbox && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPreviewLightbox(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">{previewLightbox.title}</h4>
                  {previewLightbox.subtitle && (
                    <p className="text-xs text-gray-400 mt-0.5">{previewLightbox.subtitle}</p>
                  )}
                </div>
                <button 
                  onClick={() => setPreviewLightbox(null)} 
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-black/90 flex-1 flex items-center justify-center overflow-auto min-h-[300px]">
                {previewLightbox.isPdf ? (
                  <div className="text-center p-8 text-white space-y-4">
                    <FileText className="w-16 h-16 mx-auto text-red-500" />
                    <p className="text-sm font-semibold">PDF Document Attachment</p>
                    <a
                      href={previewLightbox.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Open / Download PDF
                    </a>
                  </div>
                ) : (
                  <img 
                    src={previewLightbox.url} 
                    alt={previewLightbox.title} 
                    className="max-h-[70vh] w-auto object-contain rounded-lg"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
