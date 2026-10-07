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
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 1.5, 
        delay: delay, 
        type: "spring", 
        bounce: 0.2 
      }}
      className={cn("absolute z-20 pointer-events-auto", className)}
    >
      <motion.div
        animate={{ 
          y: [0, -yOffset, 0, yOffset / 2, 0],
          x: [0, yOffset / 2, 0, -yOffset / 2, 0],
          rotate: [0, 1.5, 0, -1.5, 0]
        }}
        transition={{ 
          duration: 8 + Math.random() * 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={cn(
          "bg-white/10 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] ring-1 ring-white/10 rounded-[2rem] overflow-hidden cursor-pointer group",
          "hover:bg-white/20 hover:scale-105 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
