import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Image as ImageIcon, Video, HardDrive, 
  Upload, Search, Filter, RefreshCw, Trash2, Eye, Download, 
  X, CheckCircle2, AlertTriangle, AlertCircle, Car, MapPin, 
  Calendar, ShieldCheck, ChevronRight, FileCheck, ExternalLink,
  Layers, Plus
} from 'lucide-react';
import contentService from '@/services/contentService';
import vehicleService from '@/services/vehicleService';
import tripService from '@/services/tripService';
import { MediaItem, MediaSummary, Vehicle, Trip } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function AdminMedia() {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<'VEHICLES' | 'TRIPS' | 'ALL'>('VEHICLES');

  // Data states
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [summary, setSummary] = useState<MediaSummary>({
    totalVehicleDocuments: 0,
    totalVehicleImages: 0,
    totalTripMedia: 0,
    totalStorageSizeBytes: 0,
    formattedTotalSize: '0 B'
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('ALL');

  // Loading & feedback states
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Upload Form state
  const [uploadEntityType, setUploadEntityType] = useState<'VEHICLE' | 'TRIP'>('VEHICLE');
  const [uploadEntityId, setUploadEntityId] = useState<number>(1);
  const [uploadRouteId, setUploadRouteId] = useState<number>(1);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('INSURANCE');
  const [uploadStatus, setUploadStatus] = useState('VALID');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load vehicles and trips for selectors
  const loadEntities = async () => {
    try {
      const [vList, tList] = await Promise.all([
        vehicleService.getAll(),
        tripService.getAll()
      ]);
      setVehicles(Array.isArray(vList) ? vList : []);
      setTrips(Array.isArray(tList) ? tList : []);
      if (Array.isArray(vList) && vList.length > 0) {
        setUploadEntityId(vList[0].vehicleId);
      }
    } catch (e) {
      console.warn('Could not load vehicles or trips reference data:', e);
    }
  };

  // Load summary and media list
  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, allMedia] = await Promise.all([
        contentService.getMediaSummary(),
        contentService.searchMediaItems()
      ]);
      if (summaryData) setSummary(summaryData);
      setMediaList(Array.isArray(allMedia) ? allMedia : []);
    } catch (err: any) {
      console.error('Failed to load media data:', err);
      showToast('Failed to connect to Media Service. Verify content-service is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();
    loadData();
  }, []);

  // Filter media items
  const filteredItems = mediaList.filter(item => {
    // 1. Tab filter
    if (activeTab === 'VEHICLES' && item.entityType !== 'VEHICLE') return false;
    if (activeTab === 'TRIPS' && item.entityType !== 'TRIP') return false;

    // 2. Entity filter
    if (selectedEntityId !== 'ALL') {
      const idNum = parseInt(selectedEntityId, 10);
      if (item.entityType === 'VEHICLE' && item.vehicleId !== idNum) return false;
      if (item.entityType === 'TRIP' && item.tripId !== idNum) return false;
    }

    // 3. Category filter
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

    // 4. Media type filter
    if (selectedMediaType !== 'ALL' && item.mediaType !== selectedMediaType) return false;

    // 5. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchFilename = (item.originalFileName || '').toLowerCase().includes(q);
      const matchCategory = (item.category || '').toLowerCase().includes(q);
      const matchReg = (item.registration || '').toLowerCase().includes(q);
      if (!matchTitle && !matchFilename && !matchCategory && !matchReg) return false;
    }

    return true;
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Size check (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size exceeds the 10MB coursework limit');
        setSelectedFile(null);
        return;
      }
      // Extension check
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const allowed = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4'];
      if (!allowed.includes(ext)) {
        setFileError(`Unsupported file format .${ext}. Allowed formats: JPG, PNG, WEBP, PDF, MP4`);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      if (!uploadTitle.trim()) {
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setUploadTitle(baseName.replace(/[-_]/g, ' '));
      }
    }
  };

  // Submit Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Please select a file to upload');
      return;
    }

    setActionLoading(true);
    setFileError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', uploadTitle || selectedFile.name);
      formData.append('description', uploadDescription);
      formData.append('category', uploadCategory);
      formData.append('status', uploadStatus);

      if (uploadEntityType === 'VEHICLE') {
        await contentService.uploadVehicleMediaFile(uploadEntityId, formData);
        showToast(`Vehicle media '${selectedFile.name}' stored successfully on server disk & MongoDB!`);
      } else {
        if (uploadRouteId) formData.append('routeId', uploadRouteId.toString());
        await contentService.uploadTripMediaFile(uploadEntityId, formData);
        showToast(`Trip media '${selectedFile.name}' stored successfully on server disk & MongoDB!`);
      }

      // Reset form & close modal
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadTitle('');
      setUploadDescription('');
      loadData();
    } catch (err: any) {
      console.error('Upload failed:', err);
      const msg = err.response?.data?.message || err.message || 'File upload failed. Ensure content-service is active.';
      setFileError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Delete
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      if (selectedItem.entityType === 'VEHICLE') {
        await contentService.deleteVehicleMediaItem(selectedItem.vehicleId || 1, selectedItem.id);
      } else {
        await contentService.deleteTripMediaItem(selectedItem.tripId || 1, selectedItem.id);
      }
      showToast(`Media record '${selectedItem.title}' and local storage file removed.`);
      setShowDeleteModal(false);
      setSelectedItem(null);
      loadData();
    } catch (err: any) {
      console.error('Delete failed:', err);
      showToast(err.response?.data?.message || 'Failed to delete media item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || 'VALID').toUpperCase();
    if (s === 'VALID' || s === 'ACTIVE') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VALID</span>;
    }
    if (s === 'EXPIRED') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">EXPIRED</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{s}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-24 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              toast.type === 'success' 
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' 
                : 'bg-rose-950/80 border-rose-500/30 text-rose-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          PAGE HEADER
          ───────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
              MongoDB Polyglot Persistence
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Local Storage Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Media Management
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Store and retrieve vehicle legal compliance documents (Insurance, Registration, Emission) and journey multimedia with MongoDB document metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1a1b23] border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-400' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => {
              setSelectedFile(null);
              setFileError('');
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02]"
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </button>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          SUMMARY METRICS CARDS
          ───────────────────────────────────────────────────────────── */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Vehicle Documents */}
        <motion.div variants={fadeUp} className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vehicle Documents</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{summary.totalVehicleDocuments}</span>
            <span className="text-xs text-gray-400 ml-2">Certificates</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Insurance, License, Eco Tests
          </div>
        </motion.div>

        {/* Card 2: Vehicle Images */}
        <motion.div variants={fadeUp} className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vehicle Images</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{summary.totalVehicleImages}</span>
            <span className="text-xs text-gray-400 ml-2">Fleet Photos</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Coach Exterior & Cabins
          </div>
        </motion.div>

        {/* Card 3: Trip Media */}
        <motion.div variants={fadeUp} className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Trip Media</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{summary.totalTripMedia}</span>
            <span className="text-xs text-gray-400 ml-2">Assets</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Dashcam & Waypoint Shots
          </div>
        </motion.div>

        {/* Card 4: Storage Used */}
        <motion.div variants={fadeUp} className="bg-[#12131a]/80 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Storage Disk Usage</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{summary.formattedTotalSize}</span>
            <span className="text-xs text-gray-400 ml-2">Local Disk</span>
          </div>
          <div className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> ./storage/media Directory
          </div>
        </motion.div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          NAVIGATION TABS & SEARCH TOOLBAR
          ───────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="bg-[#13141d]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4">
        {/* Top: Pill Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-1.5 bg-[#0a0b10]/80 p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('VEHICLES')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'VEHICLES'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              Vehicle Documents & Images
            </button>

            <button
              onClick={() => setActiveTab('TRIPS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'TRIPS'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Trip Multimedia
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'ALL'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Media Records
            </button>
          </div>

          <div className="text-xs text-gray-400 font-medium">
            Showing <span className="text-white font-bold">{filteredItems.length}</span> of {mediaList.length} items
          </div>
        </div>

        {/* Bottom: Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search title, filename, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Entity Selector Filter */}
          <div>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="ALL">All Entities ({activeTab === 'VEHICLES' ? 'Vehicles' : activeTab === 'TRIPS' ? 'Trips' : 'Vehicles & Trips'})</option>
              {activeTab !== 'TRIPS' && vehicles.map(v => (
                <option key={`v-${v.vehicleId}`} value={v.vehicleId}>
                  Vehicle #{v.vehicleId} — {v.registrationNumber} ({v.model || v.type})
                </option>
              ))}
              {activeTab !== 'VEHICLES' && trips.map(t => (
                <option key={`t-${t.tripId}`} value={t.tripId}>
                  Trip #{t.tripId} — Route {t.routeId || 1}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="ALL">All Categories</option>
              <option value="INSURANCE">Insurance Certificates</option>
              <option value="REGISTRATION">Vehicle Registration</option>
              <option value="REVENUE_LICENSE">Revenue Licenses</option>
              <option value="EMISSION_TEST">Emission Tests (Eco)</option>
              <option value="ROUTE_PERMIT">Route Permits</option>
              <option value="INSPECTION">Depot Inspections</option>
              <option value="IMAGE">Vehicle Photos</option>
              <option value="PHOTO">Trip Photographs</option>
              <option value="DASHCAM">Highway Dashcam</option>
            </select>
          </div>

          {/* Media Type Filter */}
          <div>
            <select
              value={selectedMediaType}
              onChange={(e) => setSelectedMediaType(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="ALL">All Media Types</option>
              <option value="DOCUMENT">Documents (PDF)</option>
              <option value="IMAGE">Images (JPG, PNG)</option>
              <option value="VIDEO">Videos (MP4)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          MEDIA ITEMS GRID
          ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-[#13141d]/50 animate-pulse border border-white/5 p-4 flex flex-col justify-between">
              <div className="h-32 bg-white/5 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible"
          className="text-center py-16 bg-[#13141d]/40 rounded-3xl border border-white/5 p-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No media records found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mt-1 mb-6">
            No certificates or multimedia match your active filters. Upload a document or reset your search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedMediaType('ALL');
              setSelectedEntityId('ALL');
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-all"
          >
            Clear All Filters
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredItems.map(item => {
            const previewUrl = contentService.getMediaPreviewUrl(item);
            const isImage = item.mediaType === 'IMAGE';
            const isVideo = item.mediaType === 'VIDEO';

            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="bg-[#13141d]/90 backdrop-blur-md border border-white/10 hover:border-purple-500/30 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group"
              >
                {/* Visual Thumbnail Area */}
                <div className="relative h-44 bg-[#0a0b10] overflow-hidden flex items-center justify-center border-b border-white/5">
                  {isImage && previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                  ) : isVideo ? (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform">
                        <Video className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold text-gray-300">Operational Video</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform">
                        <FileText className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">{item.category}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">PDF Certificate</span>
                    </div>
                  )}

                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                      {item.entityType === 'VEHICLE' ? <Car className="w-3 h-3 text-blue-400" /> : <MapPin className="w-3 h-3 text-purple-400" />}
                      {item.entityType === 'VEHICLE' ? `Vehicle #${item.vehicleId}` : `Trip #${item.tripId}`}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  {/* File Type Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-gray-300 border border-white/10">
                      {item.mediaType}
                    </span>
                  </div>

                  {/* Local Storage Indicator */}
                  {item.isLocalFile && (
                    <div className="absolute bottom-2 left-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 backdrop-blur-md">
                        <HardDrive className="w-2.5 h-2.5" /> Disk Stored
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-1 mb-2 font-mono">
                      {item.originalFileName || 'attachment.pdf'}
                    </p>

                    {item.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{item.formattedFileSize || (item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : 'Verified')}</span>
                    <span className="text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Active'}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 py-3 bg-[#0a0b10]/60 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowPreviewModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-200 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    Preview
                  </button>

                  <a
                    href={contentService.getMediaDownloadUrl(item)}
                    target="_blank"
                    rel="noreferrer"
                    download={item.originalFileName || 'media_asset'}
                    className="flex items-center justify-center p-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                    title="Download Media File"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                  </a>

                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center justify-center p-2 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                    title="Delete Media Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: UPLOAD MEDIA
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#13141d] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Upload Media Asset</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Saves binary file to local disk and metadata to MongoDB.</p>
                </div>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {fileError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Category Type Radio */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-2">Media Content Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadEntityType('VEHICLE');
                        setUploadCategory('INSURANCE');
                      }}
                      className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                        uploadEntityType === 'VEHICLE'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-[#0a0b10] border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <Car className="w-4 h-4" /> Vehicle Document/Photo
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadEntityType('TRIP');
                        setUploadCategory('PHOTO');
                      }}
                      className={`p-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                        uploadEntityType === 'TRIP'
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-[#0a0b10] border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <Video className="w-4 h-4" /> Trip Multimedia
                    </button>
                  </div>
                </div>

                {/* Entity Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    {uploadEntityType === 'VEHICLE' ? 'Associate with Vehicle (Oracle FK)' : 'Associate with Scheduled Trip'}
                  </label>
                  <select
                    value={uploadEntityId}
                    onChange={(e) => setUploadEntityId(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {uploadEntityType === 'VEHICLE' ? (
                      vehicles.map(v => (
                        <option key={v.vehicleId} value={v.vehicleId}>
                          Vehicle #{v.vehicleId} — {v.registrationNumber} ({v.type})
                        </option>
                      ))
                    ) : (
                      trips.map(t => (
                        <option key={t.tripId} value={t.tripId}>
                          Trip #{t.tripId} — Route {t.routeId || 1}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Document / Media Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      {uploadEntityType === 'VEHICLE' ? (
                        <>
                          <option value="INSURANCE">Insurance Certificate</option>
                          <option value="REGISTRATION">Registration (CR)</option>
                          <option value="REVENUE_LICENSE">Revenue License</option>
                          <option value="EMISSION_TEST">Emission Test</option>
                          <option value="ROUTE_PERMIT">Route Permit</option>
                          <option value="INSPECTION">Depot Inspection</option>
                          <option value="IMAGE">Vehicle Photograph</option>
                          <option value="OTHER">Other Attachment</option>
                        </>
                      ) : (
                        <>
                          <option value="PHOTO">Scenic Trip Photo</option>
                          <option value="DASHCAM">Highway Dashcam</option>
                          <option value="SCHEDULE">Journey Schedule PDF</option>
                          <option value="DOCUMENT">Waybill / Transit Doc</option>
                          <option value="OTHER">Other Multimedia</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Status</label>
                    <select
                      value={uploadStatus}
                      onChange={(e) => setUploadStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="VALID">VALID</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING">PENDING</option>
                      <option value="EXPIRED">EXPIRED</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Title / Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026 Comprehensive Fleet Insurance"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Operational remarks or certification details..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#0a0b10] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Select File (Max 10MB)</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/15 hover:border-purple-500/50 rounded-2xl p-6 text-center cursor-pointer bg-[#0a0b10]/40 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    {selectedFile ? (
                      <div>
                        <p className="text-xs font-bold text-white">{selectedFile.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-medium text-gray-300">Click to browse or drag & drop</p>
                        <p className="text-[10px] text-gray-400 mt-1">Supports PDF, JPG, PNG, WebP, MP4</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || !selectedFile}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    Store Media
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: PREVIEW MEDIA & INSPECT METADATA
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreviewModal && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#13141d] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {selectedItem.entityType === 'VEHICLE' ? `Vehicle #${selectedItem.vehicleId}` : `Trip #${selectedItem.tripId}`}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {selectedItem.category}
                    </span>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedItem.title}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedItem.originalFileName}</p>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-4">
                <div className="bg-[#0a0b10] rounded-2xl p-3 border border-white/5 flex items-center justify-center min-h-[250px]">
                  {selectedItem.mediaType === 'IMAGE' ? (
                    <img 
                      src={contentService.getMediaPreviewUrl(selectedItem)} 
                      alt={selectedItem.title} 
                      className="max-h-[350px] w-auto max-w-full rounded-xl object-contain shadow-lg"
                    />
                  ) : selectedItem.mediaType === 'VIDEO' ? (
                    <video 
                      controls 
                      src={contentService.getMediaPreviewUrl(selectedItem)} 
                      className="max-h-[350px] w-full rounded-xl"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="text-center p-8">
                      <FileText className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                      <p className="text-sm font-bold text-white">{selectedItem.originalFileName}</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                        PDF Certificate document is safely stored in local server storage. Download or open in browser to inspect.
                      </p>
                      <a
                        href={contentService.getMediaPreviewUrl(selectedItem)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Document in Full Viewer
                      </a>
                    </div>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0a0b10]/60 p-4 rounded-2xl border border-white/5 text-xs">
                  <div>
                    <span className="text-gray-400 block">Content Type</span>
                    <span className="text-white font-mono mt-0.5 block">{selectedItem.contentType || selectedItem.mediaType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">File Size</span>
                    <span className="text-white font-mono mt-0.5 block">{selectedItem.formattedFileSize || 'Standard'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Storage Engine</span>
                    <span className="text-white mt-0.5 block">{selectedItem.isLocalFile ? 'Local Disk (Node)' : 'External / Seed'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Created At</span>
                    <span className="text-white mt-0.5 block">{selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-xs text-gray-400 font-mono">
                  ID: {selectedItem.id}
                </span>

                <div className="flex items-center gap-3">
                  <a
                    href={contentService.getMediaDownloadUrl(selectedItem)}
                    target="_blank"
                    rel="noreferrer"
                    download={selectedItem.originalFileName}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Download Asset
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: DELETE CONFIRMATION
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#13141d] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white">Delete Media Item?</h3>
              <p className="text-xs text-gray-400 mt-2">
                Are you sure you want to delete <span className="text-white font-semibold">"{selectedItem.title}"</span>?
                This will delete the metadata document from MongoDB and permanently remove the file bytes from the local media storage directory.
              </p>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
