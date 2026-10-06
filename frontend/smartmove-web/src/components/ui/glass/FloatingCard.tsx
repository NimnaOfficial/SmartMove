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
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        type: "spring", 
        bounce: 0.4 
      }}
      className="absolute z-20"
    >
      <motion.div
        animate={{ y: [0, -yOffset, 0] }}
        transition={{ 
          duration: 4 + Math.random() * 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={cn(
          "bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl overflow-hidden cursor-pointer group",
          "hover:bg-white/30 transition-all duration-300",
          className
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
