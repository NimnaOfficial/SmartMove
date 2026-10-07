import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export default function FloatingCard({ children, className, delay = 0, yOffset = 15 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 1.2, 
        delay: delay, 
        type: "spring", 
        bounce: 0.3 
      }}
      className="absolute z-20 pointer-events-auto"
    >
      <motion.div
        animate={{ y: [0, -yOffset, 0] }}
        transition={{ 
          duration: 4 + Math.random() * 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={cn(
          "bg-white/20 backdrop-blur-xl shadow-2xl shadow-blue-900/10 rounded-2xl overflow-hidden cursor-pointer group",
          "hover:bg-white/30 hover:shadow-blue-900/20 transition-all duration-500",
          className
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
