import { motion } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Zap, Navigation, Star, MapPin, Globe, Mail, Phone, MessageSquare } from 'lucide-react';
import Navbar from '@/components/layout/navbar/Navbar';
import FloatingCard from '@/components/ui/glass/FloatingCard';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } }
};

export default function Home() {
  return (
    <div className="w-full bg-white text-gray-900 font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* =========================================
          SECTION 1: HERO
          ========================================= */}
      <section className="relative min-h-screen w-full flex items-center justify-center pt-24 overflow-hidden pointer-events-none">
        
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Scenic Travel Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent w-full lg:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20 mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Removed max-w-7xl, using full width with padding to fix the huge left gap */}
        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 xl:px-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pointer-events-auto">
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="flex flex-col gap-8 w-full max-w-2xl pt-10"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 w-fit bg-white/10 backdrop-blur-xl rounded-full px-5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              <span className="text-xs font-medium tracking-widest text-white uppercase opacity-90">Built for Seamless Travel</span>
            </motion.div>

            {/* Font weight reduced from bold to medium/semibold for a classic elegant look */}
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-white leading-[1.1] drop-shadow-lg">
              Smarter Transit <br />
              <span className="font-serif italic text-blue-300 drop-shadow-md">for</span> Better <br />
              Journeys
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-200 leading-relaxed font-light drop-shadow-md">
              SmartMove combines advanced routing with a seamless booking experience — beautifully designed for modern commuters.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 mt-2">
              <button className="group flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-500 transition-all duration-500 shadow-[0_8px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_40px_rgba(37,99,235,0.6)]">
                Book a Trip
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group flex items-center gap-4 text-white font-medium hover:text-blue-300 transition-colors">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.2)] group-hover:bg-white/20 transition-all ring-1 ring-white/10">
                  <Play className="w-5 h-5 fill-current ml-1" />
                </div>
                Watch Video
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-8 md:gap-12 mt-6 pt-8 border-t border-white/10">
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-7 h-7 text-blue-400" />
                <div>
                  <p className="font-medium text-white text-sm">Secure Booking</p>
                  <p className="text-xs text-gray-400 font-light">Encrypted payments</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Zap className="w-7 h-7 text-blue-400" />
                <div>
                  <p className="font-medium text-white text-sm">Real-time Data</p>
                  <p className="text-xs text-gray-400 font-light">Live tracking</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Navigation className="w-7 h-7 text-blue-400" />
                <div>
                  <p className="font-medium text-white text-sm">Smart Routes</p>
                  <p className="text-xs text-gray-400 font-light">Optimized speeds</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* Floating Cards - Placed absolutely over the entire Hero background for a cinematic free-floating look */}
        <div className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block max-w-[2000px] mx-auto">
          <FloatingCard delay={0.4} yOffset={25} className="top-[25%] right-[10%] xl:right-[15%] p-6 pr-16 flex items-center gap-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 text-blue-300 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-lg font-medium text-white tracking-wide">Verified Drivers</p>
              <p className="text-sm text-gray-300 font-light mt-0.5">Top-rated professionals</p>
            </div>
          </FloatingCard>

          <FloatingCard delay={0.6} yOffset={35} className="bottom-[25%] right-[25%] xl:right-[30%] p-6 w-80">
            <div className="flex gap-5 items-center">
              <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-2xl shrink-0">
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" alt="Bus" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-lg font-medium text-white tracking-wide">Luxury Fleet</p>
                <p className="text-sm text-gray-300 font-light mt-1.5 leading-snug">Comfortable cross-country travel</p>
              </div>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* =========================================
          SECTION 2: FEATURES & TECHNOLOGY
          ========================================= */}
      <section className="relative py-32 px-8 md:px-16 lg:px-24 xl:px-32 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
        
        <div className="w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 relative z-10">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={staggerContainer}
            className="flex-1 space-y-10 w-full lg:max-w-xl"
          >
            <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-medium tracking-tight text-gray-900 leading-[1.1]">
              Next-Gen <br />
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Fleet</span> Management
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-500 font-light leading-relaxed">
              Our hybrid architecture ensures real-time reliability for schedules and dynamic media-rich experiences for passengers.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="space-y-8 pt-6">
              {[
                { title: 'Live GPS Tracking', desc: 'Monitor your vehicle in real-time on our interactive map.' },
                { title: 'Instant E-Tickets', desc: 'Book, pay, and receive your digital ticket instantly.' },
                { title: 'Automated Maintenance', desc: 'Vehicles are algorithmically scheduled for safety checks.' }
              ].map((feature, idx) => (
                <motion.div key={idx} variants={fadeUp} className="flex gap-6 group cursor-pointer">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-center justify-center shrink-0 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white group-hover:shadow-[0_8px_40px_rgba(37,99,235,0.4)] transition-all duration-500">
                    <Navigation className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <p className="text-base font-light text-gray-500">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={slideInRight}
            className="flex-1 relative w-full h-[600px] lg:h-[800px] rounded-[3rem] overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
          >
            <img 
              src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=2072&auto=format&fit=crop" 
              alt="Mountain Road" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
            
            <motion.div 
              variants={fadeUp}
              className="absolute bottom-10 left-10 right-10 bg-white/20 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.2)] ring-1 ring-white/20"
            >
              <div className="flex justify-between items-center text-white">
                <div>
                  <p className="text-sm uppercase tracking-widest font-medium text-blue-200">Route Active</p>
                  <p className="text-2xl font-medium mt-2 drop-shadow-lg">Mountain Pass Express</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] text-gray-900 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                  <ArrowRight className="w-6 h-6 -rotate-45" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          SECTION 3: REVIEWS
          ========================================= */}
      <section className="relative py-32 px-8 md:px-16 lg:px-24 xl:px-32 bg-[#0a0f1c] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/15 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/15 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="relative z-10 w-full"
        >
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
            <div>
              <h2 className="text-5xl md:text-6xl font-medium tracking-tight mb-6">
                Passenger <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Stories</span>
              </h2>
              <p className="text-gray-400 max-w-lg text-xl font-light leading-relaxed">Real feedback dynamically loaded from our high-performance document database.</p>
            </div>
            <button className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest hover:text-blue-400 transition-colors bg-white/5 px-6 py-3 rounded-full hover:bg-white/10">
              View All Reviews <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { name: "Sarah Jenkins", route: "Coastal Line", text: "The most comfortable trip I've taken. The real-time tracking feature saved me from waiting in the rain.", rating: 5 },
              { name: "Marcus Doe", route: "Express 104", text: "Impeccable service. The driver was extremely professional and the vehicle was spotless.", rating: 5 },
              { name: "Elena Rivers", route: "Mountain Pass", text: "Loved the digital ticketing. So much easier than printing. Will definitely use SmartMove again.", rating: 4 }
            ].map((review, i) => (
              <motion.div 
                key={i} 
                variants={fadeUp} 
                className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] ring-1 ring-white/5 hover:bg-white/10 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex gap-1.5 mb-10">
                  {[...Array(review.rating)].map((_, idx) => <Star key={idx} className="w-6 h-6 fill-blue-400 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />)}
                  {[...Array(5-review.rating)].map((_, idx) => <Star key={idx} className="w-6 h-6 text-gray-700" />)}
                </div>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed font-serif font-light italic">"{review.text}"</p>
                <div className="flex items-center gap-5 mt-auto">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-medium text-xl text-white shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white text-lg">{review.name}</p>
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-medium mt-1">{review.route}</p>
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
      <section className="py-40 px-8 md:px-16 lg:px-24 xl:px-32 bg-white flex flex-col items-center justify-center text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white pointer-events-none" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={staggerContainer}
          className="max-w-4xl relative z-10"
        >
          <motion.div variants={fadeUp} className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <MapPin className="w-12 h-12 text-blue-600" />
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-6xl md:text-8xl font-medium tracking-tight text-gray-900 mb-10 leading-[1.1]">
            Ready to <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Move?</span>
          </motion.h2>
          
          <motion.p variants={fadeUp} className="text-2xl text-gray-500 font-light mb-14">
            Join thousands of passengers experiencing the future of transit today.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex justify-center">
            <button className="group flex items-center gap-4 bg-gray-900 text-white px-12 py-6 rounded-full font-medium text-xl hover:bg-blue-600 transition-all duration-500 hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)]">
              Start Your Journey
              <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================
          FOOTER
          ========================================= */}
      <footer className="bg-white py-20 px-8 md:px-16 lg:px-24 xl:px-32 shadow-[0_-20px_60px_rgba(0,0,0,0.03)] relative z-20">
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 text-3xl font-medium tracking-tight text-gray-900 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              SmartMove
            </div>
            <p className="text-gray-500 text-base font-light leading-relaxed mb-8">
              Combining advanced routing with a seamless booking experience. Built for passengers, drivers, and daily commuters.
            </p>
            <div className="flex items-center gap-5 text-gray-400">
              <Globe className="w-6 h-6 hover:text-blue-600 cursor-pointer transition-colors" />
              <Mail className="w-6 h-6 hover:text-blue-600 cursor-pointer transition-colors" />
              <Phone className="w-6 h-6 hover:text-blue-600 cursor-pointer transition-colors" />
              <MessageSquare className="w-6 h-6 hover:text-blue-600 cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="flex gap-20">
            <div className="flex flex-col gap-5">
              <h4 className="font-medium text-gray-900 text-lg mb-2">Platform</h4>
              <a href="#" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Search Routes</a>
              <a href="#" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Our Fleet</a>
              <a href="#" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Driver Portal</a>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="font-medium text-gray-900 text-lg mb-2">Company</h4>
              <a href="#" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">About Us</a>
              <a href="#" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Careers</a>
              <a href="#" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="w-full mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <p className="text-base font-light text-gray-400">© 2026 SmartMove Transport Solutions. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-base font-light text-gray-400 hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-base font-light text-gray-400 hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
