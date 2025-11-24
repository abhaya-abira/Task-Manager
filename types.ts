
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  icon: 'college' | 'job' | 'upskilling' | 'workout';
  color: string; // hex or tailwind class identifier
  tasks: Task[];
}

export interface OverflowTask {
  id: string;
  text: string;
  originPillarTitle: string; // "College", "Workout", "General", etc.
  dateMissed: string;
  createdAt: number;
}

export interface AppState {
  pillars: Pillar[];
  generalTasks: Task[];
  overflowTasks: OverflowTask[];
  streak: number;
  lastCompletedDate: string | null; // ISO Date string 'YYYY-MM-DD' for streak calculation
  lastActiveDate: string; // ISO Date string 'YYYY-MM-DD' for Midnight Audit
}