import React, { useState } from 'react';
import { Plus, Command } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAddTask(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-6 group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-primary transition-colors">
        <Plus size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new task to conquer..."
        className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-12 text-text placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-zinc-800/50 px-2 font-mono text-[10px] font-medium text-textMuted opacity-100">
          <span className="text-xs">↵</span>
          ENTER
        </kbd>
        <button 
            type="submit" 
            className="sm:hidden bg-primary/20 text-primary p-1 rounded hover:bg-primary/30"
        >
            <Plus size={16} />
        </button>
      </div>
    </form>
  );
};
