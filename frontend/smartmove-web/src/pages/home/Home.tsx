import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Navigation, Star, Ticket, Bell, MessageCircle, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/footer/Footer';
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
              <span className="text-xs font-medium tracking-widest text-white uppercase opacity-90">Seamless E-Ticketing System</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-white leading-[1.1] drop-shadow-lg">
              Smarter Transit <br />
              <span className="font-serif italic text-blue-300 drop-shadow-md">for</span> Better <br />
              Journeys
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-200 leading-relaxed font-light drop-shadow-md">
              Discover routes, book tickets securely, and manage your entire travel experience through our hybrid data platform.
            </motion.p>

            {/* Spec: Primary Actions -> Search Trips, Login/Register */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 mt-2">
              <Link to="/passenger/trips" className="group flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-500 transition-all duration-500 shadow-[0_8px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_40px_rgba(37,99,235,0.6)]">
                Search Trips
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="group flex items-center gap-4 text-white font-medium hover:text-blue-300 transition-colors bg-white/10 px-8 py-4 rounded-full backdrop-blur-md ring-1 ring-white/20">
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Cards (Background Visuals) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block max-w-[2000px] mx-auto">
          <FloatingCard delay={0.4} yOffset={25} className="top-[25%] right-[10%] xl:right-[15%] p-6 pr-16 flex items-center gap-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 text-blue-300 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-lg font-medium text-white tracking-wide">Secure Payments</p>
              <p className="text-sm text-gray-300 font-light mt-0.5">Instant booking confirmation</p>
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
          SECTION 2: CORE SERVICES (As per CW Spec)
          ========================================= */}
      <section className="py-32 px-8 md:px-16 lg:px-24 xl:px-32 bg-gray-50/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6">Everything you need for the perfect journey</h2>
            <p className="text-xl text-gray-500 font-light">Powered by our robust Oracle + MongoDB hybrid architecture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Ticket, title: 'Instant Booking', desc: 'Search routes and secure your e-tickets instantly with our real-time system.' },
              { icon: Navigation, title: 'Trip Management', desc: 'Track your travel history, manage active bookings, and view route details.' },
              { icon: Bell, title: 'Live Updates', desc: 'Receive dynamic operational announcements and trip notifications.' },
              { icon: MessageCircle, title: 'Passenger Feedback', desc: 'Share your experience and read reviews from other verified passengers.' }
            ].map((service, idx) => (
              <motion.div key={idx} variants={fadeUp} className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 group border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* =========================================
          SECTION 3: MONGODB ANNOUNCEMENTS
          ========================================= */}
      <section className="py-32 px-8 md:px-16 lg:px-24 xl:px-32 bg-white">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center"
        >
          <motion.div variants={slideInRight} className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] transform -rotate-3 scale-105" />
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-10">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Service Update</p>
                    <p className="text-sm text-gray-500 font-light">High Priority</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-400">Just now</span>
              </div>
              <h4 className="text-2xl font-medium text-gray-900 mb-4">Mountain Pass Express Detour</h4>
              <p className="text-gray-500 font-light leading-relaxed mb-6">Due to heavy snowfall, all trips on the Mountain Pass route will experience a 45-minute delay. Safety is our priority.</p>
              <Link to="/passenger/announcements" className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-2">
                Read full announcement <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} className="flex-1 space-y-8">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-[1.1]">
              Real-time <br />
              <span className="font-serif italic text-blue-600">Travel Updates</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-500 font-light leading-relaxed">
              Stay informed with our dynamic announcement feed. Powered by MongoDB to deliver rich media and high-priority alerts straight to your dashboard.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link to="/passenger/announcements" className="inline-flex items-center gap-3 text-gray-900 font-medium pb-2 border-b-2 border-gray-900 hover:text-blue-600 hover:border-blue-600 transition-colors">
                View all announcements <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================
          SECTION 4: FEATURED ROUTES & REVIEWS (Hybrid Demo)
          ========================================= */}
      <section className="relative py-32 px-8 md:px-16 lg:px-24 xl:px-32 bg-[#0a0f1c] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/15 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
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
                Passenger <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Feedback</span>
              </h2>
              <p className="text-gray-400 max-w-lg text-xl font-light leading-relaxed">Real reviews loaded dynamically from our NoSQL document database.</p>
            </div>
            <Link to="/register" className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest hover:text-blue-400 transition-colors bg-white/5 px-6 py-3 rounded-full hover:bg-white/10">
              Join the Community <ArrowRight className="w-4 h-4" />
            </Link>
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
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-medium mt-1 flex items-center gap-1">
                      <Route className="w-3 h-3" /> {review.route}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
