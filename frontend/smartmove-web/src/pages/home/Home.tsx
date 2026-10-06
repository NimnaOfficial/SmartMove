import { motion } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Zap, Navigation } from 'lucide-react';
import Navbar from '@/components/layout/navbar/Navbar';
import FloatingCard from '@/components/ui/glass/FloatingCard';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 text-gray-900 font-sans">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
          alt="Scenic Travel Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft gradient overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent w-full md:w-2/3 lg:w-1/2" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/30" />
      </div>

      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6 w-fit bg-white/70 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm border border-white/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-gray-700 uppercase">Built for Seamless Travel</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.05] mb-6">
            Smarter Transit <br />
            <span className="font-serif italic font-medium text-gray-700">for</span> Better <br />
            Journeys
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg leading-relaxed">
            SmartMove combines advanced routing with a seamless booking experience — built for passengers, drivers, and daily commuters.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
            <button className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-xl hover:shadow-blue-500/25">
              Book a Trip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center gap-4 text-gray-800 font-semibold hover:text-blue-600 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 group-hover:border-blue-600 transition-colors">
                <Play className="w-4 h-4 fill-current ml-1" />
              </div>
              Watch Video
            </button>
          </motion.div>
        </motion.div>

        {/* Feature Grid (Bottom Left) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-8 md:left-16 lg:left-24 flex gap-8 md:gap-16"
        >
          <div className="flex flex-col gap-2">
            <ShieldCheck className="w-8 h-8 text-gray-800" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Secure Booking</p>
              <p className="text-xs text-gray-600">Encrypted payments</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Zap className="w-8 h-8 text-gray-800" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Real-time Data</p>
              <p className="text-xs text-gray-600">Live vehicle tracking</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Navigation className="w-8 h-8 text-gray-800" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Smart Routes</p>
              <p className="text-xs text-gray-600">Optimized for speed</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Floating Glass Cards (Visual Elements representing the dynamic UI) */}
      
      {/* Top Right Floating Card */}
      <FloatingCard 
        delay={1.5} 
        yOffset={10} 
        className="top-[20%] right-[10%] md:right-[15%] p-4 pr-12 flex items-center gap-4"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/40 text-gray-900">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Verified Drivers</p>
          <p className="text-xs text-gray-800 font-medium">Top-rated professionals</p>
        </div>
        <ArrowRight className="absolute right-4 w-4 h-4 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
      </FloatingCard>

      {/* Bottom Right Floating Card */}
      <FloatingCard 
        delay={1.8} 
        yOffset={15} 
        className="bottom-[15%] right-[5%] md:right-[10%] p-4 w-64"
      >
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0">
            <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" alt="Bus" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Luxury Fleet</p>
            <p className="text-xs text-gray-800 font-medium mt-1">Comfortable travel in extreme conditions</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-700">Explore Vehicles</span>
          <ArrowRight className="w-3 h-3 text-gray-700" />
        </div>
      </FloatingCard>

      {/* Circular Floating Element (representing the 360 degree product view in original) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 1, type: "spring" }}
        className="absolute top-[45%] right-[25%] hidden xl:flex flex-col items-center justify-center w-24 h-24 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
      >
        <p className="text-lg font-bold text-gray-900">24/7</p>
        <p className="text-[10px] text-gray-800 font-medium uppercase tracking-wider">Support</p>
      </motion.div>

    </div>
  );
}
