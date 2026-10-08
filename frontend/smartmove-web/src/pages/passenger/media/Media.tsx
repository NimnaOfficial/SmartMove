import { useState, useEffect } from 'react';
import contentService from '@/services/contentService';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Video, Filter, MapPin, Calendar, X } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Media() {
  const [filterType, setFilterType] = useState('All');
  const [filterRoute, setFilterRoute] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const mediaItems = [
    { id: 1, type: 'Image', route: 'Colombo - Kandy', trip: 'T-1042', caption: 'Scenic view of the mountains during the morning journey.', date: 'Oct 15, 2026', url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=800&q=80' },
    { id: 2, type: 'Video', route: 'Galle - Matara', trip: 'T-1045', caption: 'Coastal express passing by the ocean.', date: 'Oct 12, 2026', url: 'https://images.unsplash.com/photo-1621508654686-809f23efd636?w=800&q=80' },
    { id: 3, type: 'Image', route: 'Colombo - Kandy', trip: 'T-1020', caption: 'Luxury coach interior view.', date: 'Sep 20, 2026', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80' }
  ];

  const filteredMedia = mediaItems.filter(item => {
    return (filterType === 'All' || item.type === filterType) &&
           (filterRoute === '' || item.route.toLowerCase().includes(filterRoute.toLowerCase()));
  });

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col gap-8 w-full pb-10 relative">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Trip Media Gallery</h1>
          <p className="text-gray-500 mt-2 font-light">Explore images and videos from various routes.</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-700 font-semibold w-full md:w-auto mb-2 md:mb-0 shrink-0">
          <Filter className="w-5 h-5 text-blue-600" /> Filter Gallery:
        </div>
        
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full md:w-48 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-3 outline-none"
        >
          <option value="All">All Media Types</option>
          <option value="Image">Images</option>
          <option value="Video">Videos</option>
        </select>

        <div className="flex-1 w-full flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-blue-400 transition-colors">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Filter by Route..." 
            value={filterRoute}
            onChange={(e) => setFilterRoute(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-900 placeholder-gray-400" 
          />
        </div>
      </motion.div>

      {/* Media Grid */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.length > 0 ? filteredMedia.map((item) => (
          <motion.div 
            variants={fadeUp} 
            key={item.id} 
            className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-md transition-all"
            onClick={() => setSelectedMedia(item)}
          >
            <div className="relative h-48 overflow-hidden">
              <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                {item.type === 'Image' ? <ImageIcon className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                {item.type}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-sm">{item.route}</h3>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{item.trip}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.caption}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <Calendar className="w-3.5 h-3.5" /> {item.date}
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-10 text-center text-gray-500 font-medium">
            No media found matching your filters.
          </div>
        )}
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <h3 className="font-bold text-gray-900">{selectedMedia.route} <span className="text-gray-400 font-normal">| {selectedMedia.trip}</span></h3>
                <button onClick={() => setSelectedMedia(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-gray-100 flex-1 relative min-h-[50vh] flex items-center justify-center">
                 <img src={selectedMedia.url} alt={selectedMedia.caption} className="max-w-full max-h-[60vh] object-contain" />
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-2">{selectedMedia.caption}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {selectedMedia.date}</span>
                  <span className="flex items-center gap-1.5">
                    {selectedMedia.type === 'Image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    {selectedMedia.type}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
