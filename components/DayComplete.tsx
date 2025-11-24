import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw } from 'lucide-react';

interface DayCompleteProps {
    onReset: () => void;
}

export const DayComplete: React.FC<DayCompleteProps> = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="mt-8 relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-surface to-[#0d221a] p-8 text-center"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="flex flex-col items-center gap-4 z-10 relative">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Trophy size={32} className="text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold text-white tracking-tight">Day Complete</h3>
        <p className="text-textMuted max-w-md">
          Discipline is the bridge between goals and accomplishment. You've cleared your list today. Great work.
        </p>

        <button 
            onClick={onReset}
            className="mt-4 flex items-center gap-2 px-6 py-2 rounded-full border border-primary/30 hover:bg-primary/10 text-primary text-sm font-medium transition-all group"
        >
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            Start New Session
        </button>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
};
