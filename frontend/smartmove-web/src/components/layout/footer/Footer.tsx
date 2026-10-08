import { MapPin, Globe, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
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
            An enterprise transport management system integrating Oracle and MongoDB for real-time transit operations and seamless bookings.
          </p>
          <div className="flex items-center gap-5 text-gray-400">
            <Globe className="w-6 h-6 hover:text-blue-600 cursor-pointer transition-colors" />
            <Mail className="w-6 h-6 hover:text-blue-600 cursor-pointer transition-colors" />
            <Phone className="w-6 h-6 hover:text-blue-600 cursor-pointer transition-colors" />
          </div>
        </div>

        <div className="flex gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-gray-900 text-lg mb-2">Platform</h4>
            <Link to="/passenger/trips" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Search Trips</Link>
            <Link to="/passenger/announcements" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Announcements</Link>
            <Link to="/login" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Passenger Login</Link>
            <Link to="/login" className="text-base font-light text-gray-500 hover:text-blue-600 transition-colors">Admin Portal</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-medium text-gray-900 text-lg mb-2">Project</h4>
            <span className="text-base font-light text-gray-500">Data Management 2</span>
            <span className="text-base font-light text-gray-500">Coursework No. 1</span>
            <span className="text-base font-light text-gray-500">Microservices Architecture</span>
          </div>
        </div>
      </div>

      <div className="w-full mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <p className="text-base font-light text-gray-400">© 2026 SmartMove Transport Solutions. All rights reserved.</p>
        <div className="flex gap-8">
          <span className="text-base font-light text-gray-400">React + TypeScript</span>
          <span className="text-base font-light text-gray-400">Oracle + MongoDB</span>
        </div>
      </div>
    </footer>
  );
}
