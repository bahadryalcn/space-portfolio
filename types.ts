export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string[];
  zDistance: number;
  type: 'education' | 'work' | 'project';
  color: string;
}

export interface GameState {
  score: number;
  shield: number;
  distance: number;
  currentMilestoneIndex: number;
  isGameOver: boolean;
  gamePhase: 'start' | 'playing' | 'ending';
  speed: number;
  isPaused: boolean; // Added
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  fire: boolean;
}