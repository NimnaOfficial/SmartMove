import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Server } from 'lucide-react';
import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/footer/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function About() {
  return (
    <div className="w-full bg-white min-h-screen font-sans">
      <Navbar />

      {/* =========================================
          HERO SECTION
          ========================================= */}
      <section className="relative h-[55vh] min-h-[450px] w-full flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop"
            alt="About SmartMove"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 xl:px-32 text-center pb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6 drop-shadow-lg"
          >
            Pioneering the <span className="font-serif italic text-blue-300">Future</span> of Transit
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-200 font-light max-w-3xl mx-auto drop-shadow-md leading-relaxed"
          >
            We are redefining cross-country travel with cutting-edge microservices, real-time data integration, and an uncompromising commitment to passenger comfort.
          </motion.p>
        </div>
      </section>

      {/* =========================================
          CONTENT SECTION 1: OUR MISSION
          ========================================= */}
      <section className="py-32 px-8 md:px-16 lg:px-24 xl:px-32">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20"
        >
          <motion.div variants={fadeUp} className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-blue-50 transform rotate-3 rounded-[3rem]" />
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
              alt="Luxury Coach" 
              className="relative z-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full h-[500px] object-cover"
            />
          </motion.div>

          <motion.div variants={staggerContainer} className="flex-1 space-y-8">
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 leading-[1.1]">
              Built for the <br />
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Modern Passenger</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-xl text-gray-500 font-light leading-relaxed">
              SmartMove was founded on a simple premise: transportation should be seamless. By completely digitizing the ticketing, routing, and fleet management process, we eliminate delays and prioritize your experience.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <motion.div variants={fadeUp}>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Unmatched Safety</h4>
                <p className="text-gray-500 font-light text-sm">Algorithmic maintenance scheduling ensures every vehicle is in peak condition.</p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Optimized Routing</h4>
                <p className="text-gray-500 font-light text-sm">Real-time GPS adjustments keep you moving regardless of traffic or weather.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* =========================================
          CONTENT SECTION 2: THE TECHNOLOGY
          ========================================= */}
      <section className="py-32 px-8 md:px-16 lg:px-24 xl:px-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div variants={fadeUp} className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-white/20">
            <Server className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-medium tracking-tight mb-8">
            The <span className="font-serif italic text-blue-400">Architecture</span> Behind the Journey
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-gray-300 font-light leading-relaxed mb-12">
            This platform serves as the central deliverable for the Data Management 2 coursework. It operates on a high-performance hybrid architecture designed by an elite engineering team.
          </motion.p>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <motion.div variants={fadeUp} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium mb-3 text-blue-300">Frontend</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">Built with React, TypeScript, and Tailwind CSS. Featuring framer-motion animations and a fully responsive glassmorphic UI.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium mb-3 text-blue-300">Oracle SQL</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">Handles all relational operations: ticket transactions, scheduling, user records, and complex PL/SQL business logic.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium mb-3 text-blue-300">MongoDB</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed">Manages unstructured content feeds including high-priority announcements, passenger reviews, and vehicle media galleries.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
