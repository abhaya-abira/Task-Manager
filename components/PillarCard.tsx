
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Laptop, Dumbbell, ChevronDown, Plus } from 'lucide-react';
import { Task, Pillar } from '../types';
import { TaskItem } from './TaskItem';
import { ProgressBar } from './ProgressBar';

interface PillarCardProps {
  pillar: Pillar;
  onAddTask: (pillarId: string, text: string) => void;
  onToggleTask: (pillarId: string, taskId: string) => void;
  onDeleteTask: (pillarId: string, taskId: string) => void;
  isOpen: boolean;
  onToggleOpen: (id: string) => void;
}

const iconMap = {
  college: GraduationCap,
  job: Briefcase,
  upskilling: Laptop,
  workout: Dumbbell,
};

const colorMap: Record<string, string> = {
  college: 'text-blue-400',
  job: 'text-amber-400',
  upskilling: 'text-violet-400',
  workout: 'text-rose-400',
};

const bgMap: Record<string, string> = {
  college: 'bg-blue-400/10 border-blue-400/20 hover:border-blue-400/40',
  job: 'bg-amber-400/10 border-amber-400/20 hover:border-amber-400/40',
  upskilling: 'bg-violet-400/10 border-violet-400/20 hover:border-violet-400/40',
  workout: 'bg-rose-400/10 border-rose-400/20 hover:border-rose-400/40',
};

export const PillarCard: React.FC<PillarCardProps> = ({
  pillar,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  isOpen,
  onToggleOpen
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = iconMap[pillar.icon];

  const total = pillar.tasks.length;
  const completed = pillar.tasks.filter(t => t.completed).length;
  const progress = total === 0 ? 0 : completed / total;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTask(pillar.id, inputValue.trim());
      setInputValue('');
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
        // slight delay to allow animation to start
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 } }}
      className={`relative overflow-hidden rounded-2xl border ${bgMap[pillar.id]} transition-colors`}
    >
      {/* Header / Summary View */}
      <motion.div 
        layout="position"
        onClick={() => onToggleOpen(pillar.id)}
        className="p-5 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-black/20 ${colorMap[pillar.id]}`}>
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{pillar.title}</h3>
            <p className="text-xs text-textMuted font-mono mt-1">
              {completed}/{total} TASKS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={colorMap[pillar.id]}>
            <ProgressBar progress={progress} size={48} strokeWidth={3} />
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="text-textMuted" size={20} />
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-5"
          >
            <div className="h-px w-full bg-white/5 mb-4" />
            
            {/* Task List */}
            <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {pillar.tasks.map(task => (
                   <TaskItem
                     key={task.id}
                     task={task}
                     onToggle={(id) => onToggleTask(pillar.id, id)}
                     onDelete={(id) => onDeleteTask(pillar.id, id)}
                   />
                ))}
              </AnimatePresence>
              {pillar.tasks.length === 0 && (
                <p className="text-center text-sm text-zinc-600 py-4 italic">
                  No tasks set. Build your routine.
                </p>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Add ${pillar.title} task...`}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-text placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
