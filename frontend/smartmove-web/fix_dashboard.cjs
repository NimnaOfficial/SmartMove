const fs = require('fs');

const inputPath = 'temp_dashboard.txt';
const outputPath = 'src/pages/passenger/dashboard/PassengerDashboard.tsx';

let content = fs.readFileSync(inputPath, 'utf8');

const startPattern = '<div className="max-w-7xl mx-auto h-full grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">';
const startIndex = content.indexOf(startPattern);

const endPattern = '              </motion.div>\r\n\r\n            </motion.div>\r\n\r\n          </div>';
const endIndex = content.indexOf(endPattern);

const innerContent = content.substring(startIndex, endIndex + endPattern.length);

const newFileContent = `import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Calendar, ChevronRight,
  Clock, ShieldCheck, Mail, Phone, MessageSquare, Bell, Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function PassengerDashboard() {
  return (
    ` + innerContent + `
  );
}
`;

fs.writeFileSync(outputPath, newFileContent);
