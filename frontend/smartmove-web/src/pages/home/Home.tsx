import { motion } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Zap, Navigation, Star, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/navbar/Navbar';
import FloatingCard from '@/components/ui/glass/FloatingCard';

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function Home() {
  return (
    <div className="w-full bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* =========================================
          SECTION 1: HERO
          ========================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-24 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent w-full md:w-3/4 lg:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-2xl"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6 w-fit bg-white/70 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm border border-white/50">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-gray-700 uppercase">Built for Seamless Travel</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.05] mb-6">
            Smarter Transit <br />
            <span className="font-serif italic font-medium text-gray-700">for</span> Better <br />
            Journeys
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg leading-relaxed font-medium">
            SmartMove combines advanced routing with a seamless booking experience — built for passengers, drivers, and daily commuters.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6">
            <button className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-xl hover:shadow-blue-500/25">
              Book a Trip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center gap-4 text-gray-900 font-semibold hover:text-blue-600 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-900 group-hover:border-blue-600 transition-colors bg-white/50 backdrop-blur-sm">
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
          className="absolute bottom-12 left-8 md:left-16 lg:left-24 flex gap-8 md:gap-16 z-10 hidden sm:flex"
        >
          <div className="flex flex-col gap-2">
            <ShieldCheck className="w-8 h-8 text-gray-900" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Secure Booking</p>
              <p className="text-xs text-gray-700 font-medium">Encrypted payments</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Zap className="w-8 h-8 text-gray-900" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Real-time Data</p>
              <p className="text-xs text-gray-700 font-medium">Live vehicle tracking</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Navigation className="w-8 h-8 text-gray-900" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Smart Routes</p>
              <p className="text-xs text-gray-700 font-medium">Optimized for speed</p>
            </div>
          </div>
        </motion.div>

        {/* Floating Glass Cards */}
        <FloatingCard delay={1.5} yOffset={10} className="top-[25%] right-[5%] md:right-[15%] p-4 pr-12 flex items-center gap-4 hidden md:flex">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 text-gray-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Verified Drivers</p>
            <p className="text-xs text-gray-800 font-medium">Top-rated professionals</p>
          </div>
          <ArrowRight className="absolute right-4 w-4 h-4 text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />
        </FloatingCard>

        <FloatingCard delay={1.8} yOffset={15} className="bottom-[20%] right-[2%] md:right-[10%] p-4 w-64 hidden lg:block">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0 border border-white/40">
              <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" alt="Bus" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Luxury Fleet</p>
              <p className="text-xs text-gray-800 font-medium mt-1">Comfortable travel across the country</p>
            </div>
          </div>
        </FloatingCard>
      </section>

      {/* =========================================
          SECTION 2: FEATURES & TECHNOLOGY
          ========================================= */}
      <section className="relative py-32 px-8 md:px-16 lg:px-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          {/* Left Text */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={staggerContainer}
            className="flex-1 space-y-8"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Next-Generation <br />
              <span className="font-serif italic text-gray-500">Fleet</span> Management
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 leading-relaxed max-w-md">
              Our hybrid database architecture ensures real-time reliability for schedules and dynamic media-rich experiences for passengers.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="space-y-6 pt-4">
              {[
                { title: 'Live GPS Tracking', desc: 'Monitor your vehicle in real-time on our interactive map.' },
                { title: 'Instant E-Tickets', desc: 'Book, pay, and receive your digital ticket instantly.' },
                { title: 'Automated Maintenance', desc: 'Vehicles are algorithmically scheduled for safety checks.' }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={fadeUp} className="flex gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={slideInRight}
            className="flex-1 relative w-full h-[600px] rounded-[2.5rem] overflow-hidden group shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop" 
              alt="Mountain Road" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Glass Card over image */}
            <motion.div 
              variants={fadeUp}
              className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-xl border border-white/40 p-6 rounded-3xl"
            >
              <div className="flex justify-between items-center text-white">
                <div>
                  <p className="text-sm uppercase tracking-wider font-semibold opacity-80">Route Active</p>
                  <p className="text-2xl font-bold mt-1">Mountain Pass Express</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 -rotate-45" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: REVIEWS (MONGODB INTEGRATION)
          ========================================= */}
      <section className="relative py-32 px-8 md:px-16 lg:px-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <motion.div variants={fadeUp} className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Passenger <span className="font-serif italic text-blue-400">Stories</span>
              </h2>
              <p className="text-gray-400 max-w-md">Real feedback dynamically loaded from our high-performance document database.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-blue-400 transition-colors">
              View All Reviews <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Jenkins", route: "Coastal Line", text: "The most comfortable trip I've taken. The real-time tracking feature saved me from waiting in the rain.", rating: 5 },
              { name: "Marcus Doe", route: "Express 104", text: "Impeccable service. The driver was extremely professional and the vehicle was spotless.", rating: 5 },
              { name: "Elena Rivers", route: "Mountain Pass", text: "Loved the digital ticketing. So much easier than printing. Will definitely use SmartMove again.", rating: 4 }
            ].map((review, i) => (
              <motion.div 
                key={i} 
                variants={fadeUp} 
                className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors duration-300"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, idx) => <Star key={idx} className="w-5 h-5 fill-blue-500 text-blue-500" />)}
                  {[...Array(5-review.rating)].map((_, idx) => <Star key={idx} className="w-5 h-5 text-gray-600" />)}
                </div>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{review.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{review.route}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* =========================================
          SECTION 4: CALL TO ACTION
          ========================================= */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-white flex flex-col items-center justify-center text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={staggerContainer}
          className="max-w-3xl"
        >
          <motion.div variants={fadeUp} className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <MapPin className="w-10 h-10 text-gray-900" />
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8">
            Ready to <span className="font-serif italic text-gray-500">Move?</span>
          </motion.h2>
          
          <motion.div variants={fadeUp} className="flex justify-center">
            <button className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-900 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-gray-900/20">
              Start Your Journey
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
