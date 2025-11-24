
import React from 'react';
import { Flame, Calendar, Activity } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface StatsProps {
  streak: number;
  globalProgress: number; // 0-1
  totalTasks: number;
  completedTasks: number;
}

export const Stats: React.FC<StatsProps> = ({ streak, globalProgress, totalTasks, completedTasks }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Date Card */}
      <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-2 text-textMuted mb-2">
          <Calendar size={18} />
          <span className="text-xs uppercase tracking-wider font-semibold">Today's Protocol</span>
        </div>
        <h2 className="text-xl font-medium text-text">{today}</h2>
      </div>

      {/* Streak Card */}
      <div className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame size={48} className="text-orange-500" />
        </div>
        <div className="flex items-center gap-2 text-textMuted mb-2">
          <Flame size={18} className={streak > 0 ? "text-orange-500 fill-orange-500" : ""} />
          <span className="text-xs uppercase tracking-wider font-semibold">Consistency</span>
        </div>
        <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-text">{streak}</h2>
            <span className="text-sm text-textMuted">days</span>
        </div>
      </div>

      {/* Global Progress Card */}
      <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between shadow-sm border-r-4 border-r-surfaceHighlight">
        <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-textMuted mb-1">
                <Activity size={16} />
                <span className="text-xs uppercase tracking-wider font-semibold">Performance</span>
            </div>
            <div className="text-2xl font-bold text-text">
                {Math.round(globalProgress * 100)}%
            </div>
            <span className="text-xs text-textMuted mt-1">{completedTasks} / {totalTasks} Tasks</span>
        </div>
        <div className="text-primary">
            <ProgressBar progress={globalProgress} size={64} />
        </div>
      </div>
    </div>
  );
};
