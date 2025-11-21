import { Milestone } from './types';

export const GAME_CONFIG = {
  SHIP_SPEED: 2.0, // Increased slightly (was 1.5) for better pacing
  BOOST_SPEED: 4.0,
  ROTATION_SPEED: 0.1, // Slightly sharper rotation for visual feedback
  
  // Field of View
  MAX_X: 30, 
  MAX_Y: 16, 
  
  CAMERA_LAG: 0.08,
  LASER_COOLDOWN: 120,
  TOTAL_DISTANCE: 12000, 
  
  // Difficulty & Combat Tuning
  LASER_SPEED: 600, 
  ENEMY_SPAWN_CHANCE: 0.008, 
  ENEMY_DAMAGE: 5, 
  DRONE_SPEED: 15, 
};

export const COLORS = {
  NEON_BLUE: 0x00f3ff,
  NEON_RED: 0xff0044,
  NEON_GREEN: 0x00ff66,
  NEON_YELLOW: 0xffcc00,
  STAR_WARS_YELLOW: '#FFE81F',
};

export const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    year: '2011-2013',
    title: 'Hobby Project: SpecialWar',
    description: ['Developed an MMO FPS game.', 'Managed 2M+ registered users.', 'Custom engine modifications.'],
    zDistance: 1500,
    type: 'project',
    color: '#FF5733',
  },
  {
    id: 'm2',
    year: '2013-2018',
    title: 'Selçuk University',
    description: ['B.E. Computer Engineering.', 'Focus on System Architecture.', 'High Honors.'],
    zDistance: 3000,
    type: 'education',
    color: '#33FF57',
  },
  {
    id: 'm3',
    year: '2016-2017',
    title: 'Technical Internships',
    description: ['Full-stack development.', 'Initial exposure to enterprise patterns.', 'Agile methodologies.'],
    zDistance: 4500,
    type: 'work',
    color: '#3357FF',
  },
  {
    id: 'm4',
    year: '2019-2022',
    title: "Chang'an University",
    description: ['Masters in Software Engineering.', 'Thesis on Distributed Systems.', 'Research in AI applications.'],
    zDistance: 6500,
    type: 'education',
    color: '#F3FF33',
  },
  {
    id: 'm5',
    year: '2021-2023',
    title: 'Digital Commerce Bank',
    description: ['Senior Software Engineer.', 'Core banking infrastructure.', '.NET Core & Microservices.'],
    zDistance: 8500,
    type: 'work',
    color: '#FF33F3',
  },
  {
    id: 'm6',
    year: '2023-Present',
    title: 'Firisbe',
    description: ['Team Lead & Senior Engineer.', 'Leading a team of 10+ devs.', 'Architecting scalable React/Node solutions.'],
    zDistance: 10500,
    type: 'work',
    color: '#00f3ff',
  },
];

export const SKILLS = [
  'React', 'TypeScript', 'Node.js', '.NET Core', 'Docker', 'Kubernetes', 'MongoDB', 'Three.js', 'Team Leadership'
];