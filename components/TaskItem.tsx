import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Clock } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.005, backgroundColor: 'rgba(39, 39, 42, 0.5)' }}
      className={`
        group flex items-center justify-between p-4 mb-3 rounded-lg border transition-all duration-300 relative
        ${task.completed 
          ? 'bg-transparent border-transparent opacity-50' 
          : 'bg-surface border-border shadow-sm hover:border-zinc-700'}
      `}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => onToggle(task.id)}
          className={`
            relative flex items-center justify-center w-6 h-6 rounded-md border transition-all duration-300
            ${task.completed 
              ? 'bg-primary border-primary text-black' 
              : 'bg-transparent border-zinc-600 hover:border-primary'}
          `}
        >
          <AnimatePresence>
            {task.completed && (
              <>
                {/* Shockwave Ring */}
                <motion.div
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 border-2 border-primary rounded-md"
                  style={{ zIndex: -1 }}
                />
                
                {/* Shockwave Fill */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 bg-primary/30 rounded-md"
                  style={{ zIndex: -1 }}
                />

                {/* Check Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Check size={14} strokeWidth={3} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </button>
        
        <span 
          className={`
            text-base font-medium transition-all duration-300 truncate cursor-pointer select-none
            ${task.completed ? 'text-textMuted line-through decoration-zinc-600' : 'text-text'}
          `}
          onClick={() => onToggle(task.id)}
        >
          {task.text}
        </span>
      </div>

      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && (
            <div className="hidden sm:flex items-center text-xs text-zinc-600 font-mono gap-1">
                <Clock size={12} />
                <span>PENDING</span>
            </div>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-400/10"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
