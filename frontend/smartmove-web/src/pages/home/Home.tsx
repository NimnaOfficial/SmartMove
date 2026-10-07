import { motion } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Zap, Navigation, Star, MapPin, Globe, Mail, Phone, MessageSquare } from 'lucide-react';
import Navbar from '@/components/layout/navbar/Navbar';
import FloatingCard from '@/components/ui/glass/FloatingCard';

// Reusable animation variants (enhanced for scroll, fixed TS types)
const fadeUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } }
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
  visible: { opacity: 1, x: 0, transition: { duration: 1.2 } }
};

export default function Home() {
  return (
    <div className="w-full bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* =========================================
          SECTION 1: HERO
          ========================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-32 overflow-hidden pointer-events-none">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Scenic Travel Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent w-full lg:w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="relative z-10 w-full max-w-2xl pointer-events-auto"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-8 w-fit bg-white/70 backdrop-blur-sm rounded-full px-5 py-2 shadow-xl shadow-blue-500/10">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-gray-700 uppercase">Built for Seamless Travel</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-[1.05] mb-8">
            Smarter Transit <br />
            <span className="font-serif italic font-medium text-gray-500">for</span> Better <br />
            Journeys
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg leading-relaxed font-medium">
            SmartMove combines advanced routing with a seamless booking experience — built for passengers, drivers, and daily commuters.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6">
            <button className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-500 shadow-2xl shadow-blue-500/20">
              Book a Trip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center gap-4 text-gray-900 font-semibold hover:text-blue-600 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg shadow-gray-200 group-hover:shadow-blue-500/30 transition-shadow bg-white/50 backdrop-blur-sm">
                <Play className="w-4 h-4 fill-current ml-1" />
              </div>
              Watch Video
            </button>
          </motion.div>
        </motion.div>

        {/* Feature Grid (Bottom Left) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute bottom-12 left-8 md:left-16 lg:left-24 flex gap-8 md:gap-16 z-10 hidden md:flex pointer-events-auto"
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
        <FloatingCard delay={0.6} yOffset={10} className="top-[25%] right-[5%] lg:right-[15%] p-4 pr-12 flex items-center gap-4 hidden lg:flex">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/60 text-gray-900 shadow-inner">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Verified Drivers</p>
            <p className="text-xs text-gray-800 font-medium">Top-rated professionals</p>
          </div>
          <ArrowRight className="absolute right-4 w-4 h-4 text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />
        </FloatingCard>

        <FloatingCard delay={0.8} yOffset={15} className="bottom-[25%] right-[2%] lg:right-[10%] p-4 w-64 hidden xl:block">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg shrink-0">
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
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          {/* Left Text */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={staggerContainer}
            className="flex-1 space-y-10 w-full"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Next-Generation <br />
              <span className="font-serif italic text-gray-400">Fleet</span> Management
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-600 leading-relaxed max-w-md">
              Our hybrid database architecture ensures real-time reliability for schedules and dynamic media-rich experiences for passengers.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="space-y-8 pt-4">
              {[
                { title: 'Live GPS Tracking', desc: 'Monitor your vehicle in real-time on our interactive map.' },
                { title: 'Instant E-Tickets', desc: 'Book, pay, and receive your digital ticket instantly.' },
                { title: 'Automated Maintenance', desc: 'Vehicles are algorithmically scheduled for safety checks.' }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={fadeUp} className="flex gap-5 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-500/30 transition-all duration-500">
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
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
            className="flex-1 relative w-full h-[500px] lg:h-[700px] rounded-[3rem] overflow-hidden group shadow-2xl shadow-gray-300/50"
          >
            <img 
              src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop" 
              alt="Mountain Road" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
            />
            {/* Glass Card over image */}
            <motion.div 
              variants={fadeUp}
              className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl shadow-black/10"
            >
              <div className="flex justify-between items-center text-white">
                <div>
                  <p className="text-sm uppercase tracking-wider font-semibold opacity-90 drop-shadow-md">Route Active</p>
                  <p className="text-2xl font-bold mt-1 drop-shadow-lg">Mountain Pass Express</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white shadow-xl text-gray-900 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
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
        {/* Soft Background Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Passenger <span className="font-serif italic text-blue-400">Stories</span>
              </h2>
              <p className="text-gray-400 max-w-md text-lg">Real feedback dynamically loaded from our high-performance document database.</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-blue-400 transition-colors">
              View All Reviews <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", route: "Coastal Line", text: "The most comfortable trip I've taken. The real-time tracking feature saved me from waiting in the rain.", rating: 5 },
              { name: "Marcus Doe", route: "Express 104", text: "Impeccable service. The driver was extremely professional and the vehicle was spotless.", rating: 5 },
              { name: "Elena Rivers", route: "Mountain Pass", text: "Loved the digital ticketing. So much easier than printing. Will definitely use SmartMove again.", rating: 4 }
            ].map((review, i) => (
              <motion.div 
                key={i} 
                variants={fadeUp} 
                className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-black/20 hover:bg-white/10 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex gap-1 mb-8">
                  {[...Array(review.rating)].map((_, idx) => <Star key={idx} className="w-5 h-5 fill-blue-500 text-blue-500 drop-shadow-md" />)}
                  {[...Array(5-review.rating)].map((_, idx) => <Star key={idx} className="w-5 h-5 text-gray-700" />)}
                </div>
                <p className="text-lg text-gray-300 mb-10 leading-relaxed font-serif italic">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{review.name}</p>
                    <p className="text-xs text-blue-300 uppercase tracking-widest font-semibold">{review.route}</p>
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
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-gray-50 flex flex-col items-center justify-center text-center overflow-hidden relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={staggerContainer}
          className="max-w-3xl relative z-10"
        >
          <motion.div variants={fadeUp} className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-gray-200/50">
            <MapPin className="w-10 h-10 text-blue-600" />
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
            Ready to <span className="font-serif italic text-blue-600">Move?</span>
          </motion.h2>
          
          <motion.p variants={fadeUp} className="text-xl text-gray-600 mb-12">
            Join thousands of passengers experiencing the future of transit today.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex justify-center">
            <button className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-900 transition-all duration-500 hover:scale-105 shadow-2xl shadow-blue-600/30">
              Start Your Journey
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================
          FOOTER
          ========================================= */}
      <footer className="bg-white py-16 px-8 md:px-16 lg:px-24 shadow-[0_-20px_40px_rgb(0,0,0,0.02)] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-gray-900 mb-6">
              <MapPin className="w-8 h-8 text-blue-600" />
              SmartMove
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Combining advanced routing with a seamless booking experience. Built for passengers, drivers, and daily commuters.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <Globe className="w-5 h-5 hover:text-blue-600 cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 hover:text-blue-600 cursor-pointer transition-colors" />
              <Phone className="w-5 h-5 hover:text-blue-600 cursor-pointer transition-colors" />
              <MessageSquare className="w-5 h-5 hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900">Platform</h4>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Search Routes</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Our Fleet</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Driver Portal</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900">Company</h4>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">About Us</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Careers</a>
              <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t-0 shadow-[0_-1px_0_rgb(0,0,0,0.05)] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2026 SmartMove Transport Solutions. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
