import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle, CalendarX } from 'lucide-react';
import { OverflowTask } from '../types';

interface OverflowTaskItemProps {
  task: OverflowTask;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const OverflowTaskItem: React.FC<OverflowTaskItemProps> = ({ task, onComplete, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-surface border border-red-900/30 hover:border-red-500/30 rounded-lg p-4 mb-3 flex items-center justify-between group transition-all shadow-[0_0_15px_rgba(239,68,68,0.05)]"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 border border-red-900/50 px-1.5 rounded bg-red-950/30">
            {task.originPillarTitle}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-textMuted">
            <CalendarX size={10} />
            MISSED {task.dateMissed}
          </span>
        </div>
        <h4 className="text-text font-medium">{task.text}</h4>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onComplete(task.id)}
          className="p-2 rounded-md hover:bg-emerald-500/20 text-textMuted hover:text-emerald-500 transition-colors group/btn"
          title="Complete Task"
        >
          <Check size={18} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-md hover:bg-red-500/20 text-textMuted hover:text-red-500 transition-colors"
          title="Delete Forever"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
};