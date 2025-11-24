import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, Pillar, Task, OverflowTask } from './types';
import { Stats } from './components/Stats';
import { PillarCard } from './components/PillarCard';
import { TaskItem } from './components/TaskItem';
import { OverflowTaskItem } from './components/OverflowTaskItem';
import { DayComplete } from './components/DayComplete';
import { Layout, Layers, Archive, AlertTriangle, Infinity, Plus } from 'lucide-react';

const STORAGE_KEY = 'infine-focus-data-v1';

const INITIAL_PILLARS: Pillar[] = [
  { 
    id: 'college', 
    title: 'College', 
    description: 'Academic excellence', 
    icon: 'college', 
    color: 'blue', 
    tasks: [] 
  },
  { 
    id: 'job', 
    title: 'Part-Time Job', 
    description: 'Professional duty', 
    icon: 'job', 
    color: 'amber', 
    tasks: [] 
  },
  { 
    id: 'upskilling', 
    title: 'Upskilling', 
    description: 'Continuous improvement', 
    icon: 'upskilling', 
    color: 'violet', 
    tasks: [] 
  },
  { 
    id: 'workout', 
    title: 'Workout', 
    description: 'Physical dominance', 
    icon: 'workout', 
    color: 'rose', 
    tasks: [] 
  },
];

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getInitialState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Migration: Add new fields if missing
      return {
        pillars: parsed.pillars || INITIAL_PILLARS,
        generalTasks: parsed.generalTasks || [],
        overflowTasks: parsed.overflowTasks || [],
        streak: parsed.streak || 0,
        lastCompletedDate: parsed.lastCompletedDate || null,
        lastActiveDate: parsed.lastActiveDate || getTodayDateString(),
      };
    } catch (e) {
      console.error('Failed to parse local storage', e);
    }
  }
  return {
    pillars: INITIAL_PILLARS,
    generalTasks: [],
    overflowTasks: [],
    streak: 0,
    lastCompletedDate: null,
    lastActiveDate: getTodayDateString(),
  };
};

type ViewMode = 'dashboard' | 'overflow';

export default function App() {
  const [state, setState] = useState<AppState>(getInitialState);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [openPillarId, setOpenPillarId] = useState<string | null>(null);
  const [generalInput, setGeneralInput] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // Midnight Audit & Persistence
  useEffect(() => {
    const performMidnightAudit = () => {
      const today = getTodayDateString();
      
      // If today is different from last active date, run audit
      if (state.lastActiveDate !== today) {
        console.log("Running Midnight Audit...");
        
        const newOverflowTasks: OverflowTask[] = [];

        // 1. Harvest Uncompleted Pillar Tasks
        state.pillars.forEach(pillar => {
          pillar.tasks.forEach(task => {
            if (!task.completed) {
              newOverflowTasks.push({
                id: crypto.randomUUID(),
                text: task.text,
                originPillarTitle: pillar.title,
                dateMissed: state.lastActiveDate, // The date it was SUPPOSED to be done
                createdAt: Date.now()
              });
            }
          });
        });

        // 2. Harvest Uncompleted General Tasks
        state.generalTasks.forEach(task => {
            if (!task.completed) {
                newOverflowTasks.push({
                    id: crypto.randomUUID(),
                    text: task.text,
                    originPillarTitle: 'General',
                    dateMissed: state.lastActiveDate,
                    createdAt: Date.now()
                });
            }
        });

        // 3. Update State: Add overflow, Reset pillars/general, Update date
        setState(prev => ({
          ...prev,
          overflowTasks: [...newOverflowTasks, ...prev.overflowTasks],
          // Reset Pillar Tasks (Uncheck all)
          pillars: prev.pillars.map(p => ({
            ...p,
            tasks: p.tasks.map(t => ({ ...t, completed: false }))
          })),
          // Reset General Tasks (Uncheck all)
          generalTasks: prev.generalTasks.map(t => ({ ...t, completed: false })),
          lastActiveDate: today,
          // Note: Streak is handled separately in the next effect
        }));
      }
    };

    performMidnightAudit();
  }, []); // Run once on mount

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Streak & Celebration Logic
  useEffect(() => {
    const allPillarTasks = state.pillars.flatMap(p => p.tasks);
    const allTasks = [...allPillarTasks, ...state.generalTasks];
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.completed).length;
    const allComplete = totalTasks > 0 && completedTasks === totalTasks;

    if (allComplete) {
      const today = getTodayDateString();
      if (state.lastCompletedDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const isConsecutive = state.lastCompletedDate === yesterdayStr;
        
        setState(prev => ({
          ...prev,
          streak: isConsecutive ? prev.streak + 1 : (prev.streak > 0 && prev.lastCompletedDate === today ? prev.streak : 1),
          lastCompletedDate: today
        }));
      }
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  }, [state.pillars, state.generalTasks]); // Re-run when tasks change

  // Derived Stats
  const allPillarTasks = state.pillars.flatMap(p => p.tasks);
  const allTasks = [...allPillarTasks, ...state.generalTasks];
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.completed).length;
  const globalProgress = totalTasks === 0 ? 0 : completedTasks / totalTasks;
  const overflowCount = state.overflowTasks.length;

  // Actions
  const addPillarTask = (pillarId: string, text: string) => {
    const newTask: Task = { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() };
    setState(prev => ({
      ...prev,
      pillars: prev.pillars.map(p => p.id === pillarId ? { ...p, tasks: [newTask, ...p.tasks] } : p)
    }));
  };

  const addGeneralTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalInput.trim()) return;
    const newTask: Task = { id: crypto.randomUUID(), text: generalInput.trim(), completed: false, createdAt: Date.now() };
    setState(prev => ({ ...prev, generalTasks: [newTask, ...prev.generalTasks] }));
    setGeneralInput('');
  };

  const togglePillarTask = (pillarId: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      pillars: prev.pillars.map(p => 
        p.id === pillarId 
          ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) } 
          : p
      )
    }));
  };

  const toggleGeneralTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      generalTasks: prev.generalTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deletePillarTask = (pillarId: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      pillars: prev.pillars.map(p => p.id === pillarId ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } : p)
    }));
  };

  const deleteGeneralTask = (taskId: string) => {
    setState(prev => ({ ...prev, generalTasks: prev.generalTasks.filter(t => t.id !== taskId) }));
  };

  const completeOverflowTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      overflowTasks: prev.overflowTasks.filter(t => t.id !== taskId)
    }));
  };

  const deleteOverflowTask = (taskId: string) => {
    setState(prev => ({
        ...prev,
        overflowTasks: prev.overflowTasks.filter(t => t.id !== taskId)
    }));
  };

  const handleResetDay = () => {
    setState(prev => ({
      ...prev,
      pillars: prev.pillars.map(p => ({
        ...p,
        tasks: p.tasks.map(t => ({ ...t, completed: false }))
      })),
      generalTasks: prev.generalTasks.map(t => ({ ...t, completed: false }))
    }));
    setShowCelebration(false);
  };

  const handleTogglePillarOpen = (id: string) => {
    setOpenPillarId(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-primary/30 selection:text-primary pb-20 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-surfaceHighlight rounded-2xl flex items-center justify-center shadow-lg border border-border relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50" />
                <Infinity size={24} className="text-primary relative z-10" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">INFINE FOCUS</h1>
              <p className="text-[10px] text-textMuted font-mono tracking-[0.2em] mt-1 uppercase">Eternal Consistency Protocol</p>
            </div>
          </div>
          
          <div className="flex bg-surface p-1 rounded-lg border border-border">
            <button 
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === 'dashboard' ? 'bg-primary text-black' : 'text-textMuted hover:text-white'}`}
            >
                <Layout size={14} />
                TODAY
            </button>
            <button 
                onClick={() => setViewMode('overflow')}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === 'overflow' ? 'bg-red-500 text-black' : 'text-textMuted hover:text-white'}`}
            >
                <Archive size={14} />
                OVERFLOW
                {overflowCount > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${viewMode === 'overflow' ? 'bg-black/20 text-black' : 'bg-red-500 text-black'}`}>
                        {overflowCount}
                    </span>
                )}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
            {viewMode === 'dashboard' ? (
                <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Global Stats */}
                    <Stats 
                    streak={state.streak} 
                    globalProgress={globalProgress} 
                    totalTasks={totalTasks} 
                    completedTasks={completedTasks} 
                    />

                    {/* The 4 Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {state.pillars.map(pillar => (
                        <PillarCard 
                        key={pillar.id}
                        pillar={pillar}
                        onAddTask={addPillarTask}
                        onToggleTask={togglePillarTask}
                        onDeleteTask={deletePillarTask}
                        isOpen={openPillarId === pillar.id}
                        onToggleOpen={handleTogglePillarOpen}
                        />
                    ))}
                    </div>

                    {/* General / Misc Section */}
                    <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex items-center gap-3 mb-6 text-textMuted">
                        <Layers size={20} />
                        <h2 className="text-sm font-bold tracking-widest uppercase">General Operations</h2>
                    </div>

                    <form onSubmit={addGeneralTask} className="relative mb-6">
                        <input
                        type="text"
                        value={generalInput}
                        onChange={(e) => setGeneralInput(e.target.value)}
                        placeholder="Add miscellaneous task..."
                        className="w-full bg-surface border border-border rounded-xl py-3 pl-4 pr-12 text-text placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-all"
                        />
                        <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                        <Plus size={18} />
                        </button>
                    </form>

                    <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                        {state.generalTasks.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="text-center py-4 text-sm text-zinc-700 italic">
                            No general tasks pending.
                            </motion.div>
                        )}
                        {state.generalTasks.map(task => (
                            <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={(id) => toggleGeneralTask(id)} 
                            onDelete={(id) => deleteGeneralTask(id)} 
                            />
                        ))}
                        </AnimatePresence>
                    </div>
                    </div>

                    {/* Celebration */}
                    <AnimatePresence>
                        {showCelebration && (
                            <DayComplete onReset={handleResetDay} />
                        )}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <motion.div
                    key="overflow"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-surface/50 border border-red-900/20 rounded-2xl p-6 md:p-8 min-h-[50vh]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-950/50 rounded-xl border border-red-900/50 text-red-500">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">The Overflow Vault</h2>
                                <p className="text-textMuted text-sm">Tasks left behind. Clear your debt to restore balance.</p>
                            </div>
                        </div>

                        {overflowCount === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                <Archive size={48} className="text-zinc-700 mb-4" />
                                <p className="text-zinc-500 font-mono text-sm">VAULT EMPTY. YOU ARE DISCIPLINED.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <AnimatePresence mode="popLayout">
                                    {state.overflowTasks.map(task => (
                                        <OverflowTaskItem
                                            key={task.id}
                                            task={task}
                                            onComplete={completeOverflowTask}
                                            onDelete={deleteOverflowTask}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}