import { useState, useEffect } from 'react';
import contentService from '@/services/contentService';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const tabs = ['All', 'Unread'] as const;
type TabType = typeof tabs[number];

export default function DriverNotifications() {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  
  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
     const fetchAnnouncements = async () => {
        try {
           const data = await contentService.getAllAnnouncements();
           if (Array.isArray(data)) {
              setNotifications(data.map((a: any) => ({
                 id: a.announcementId || a.id,
                 title: a.title,
                 message: a.content,
                 time: a.createdAt || 'Recent',
                 read: false
              })));
           }
        } catch (e) {
           console.error(e);
        }
     };
     fetchAnnouncements();
  }, []);

  const filteredNotifications = notifications.filter(n => activeTab === 'All' || !n.read);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto h-full pb-10">
      
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black relative">
              <Bell className="w-6 h-6" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-100"></span>
              )}
            </div>
            Notifications
          </h1>
          <p className="text-gray-500 font-medium mt-2">Trip updates, schedule changes, and operational announcements.</p>
        </div>
        
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> Mark all as read
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-4 border-b border-gray-100 w-full">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-3 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="driverNotifTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-t-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => {
                const Icon = notif.icon;
                const isUnread = !notif.read;
                
                return (
                  <motion.div 
                    key={notif.id}
                    variants={fadeUp}
                    className={`bg-white rounded-[1.5rem] p-5 border ${isUnread ? 'border-gray-200 shadow-sm' : 'border-transparent shadow-none'} transition-all duration-300 flex gap-4 relative overflow-hidden group`}
                  >
                    {isUnread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-l-[1.5rem]" />}
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                      notif.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                      notif.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                        <h3 className={`text-base font-bold ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notif.title}
                        </h3>
                        <span className="text-xs font-bold text-gray-400 whitespace-nowrap">{notif.date}</span>
                      </div>
                      <p className={`text-sm font-medium ${isUnread ? 'text-gray-600' : 'text-gray-500'}`}>
                        {notif.message}
                      </p>
                    </div>

                    {isUnread && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity self-center w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-200"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </motion.div>
                )
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500 font-medium max-w-md">
                  You have no {activeTab === 'Unread' ? 'unread' : ''} notifications at the moment.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
