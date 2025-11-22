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
    description: [
      'Founded and developed SpecialWar MMO FPS game from scratch',
      'Scaled to 2M+ registered users with 50K+ daily active players',
      'Built custom game engine with C++ and integrated MySQL backend',
      'Managed complete tech stack: server infrastructure, game client, web platform',
      'Implemented anti-cheat systems and real-time multiplayer mechanics'
    ],
    zDistance: 1500,
    type: 'project',
    color: '#FF5733',
  },
  {
    id: 'm2',
    year: '2013-2018',
    title: 'Selçuk University',
    description: [
      'B.Sc. Computer Engineering - Graduated with High Honors (3.44/4.00 GPA)',
      'Specialized in System Architecture, Algorithms & Data Structures',
      'Published graduation project on distributed systems optimization',
      'Active member of IEEE Computer Society',
      'Led multiple academic software development projects'
    ],
    zDistance: 3000,
    type: 'education',
    color: '#33FF57',
  },
  {
    id: 'm3',
    year: '2016-2017',
    title: 'Early Career & Internships',
    description: [
      'Software Engineering Intern at Etiya (Telecom solutions)',
      'Full-stack development with ASP.NET MVC & JavaScript',
      'Worked on enterprise-grade CRM and billing systems',
      'Gained exposure to Agile/Scrum methodologies',
      'Developed RESTful APIs and integrated payment gateways'
    ],
    zDistance: 4500,
    type: 'work',
    color: '#3357FF',
  },
  {
    id: 'm4',
    year: '2019-2022',
    title: "Chang'an University - Master's Degree",
    description: [
      'M.Sc. Software Engineering (China Government Scholarship recipient)',
      'Thesis: "Optimization Strategies for Distributed Computing Systems"',
      'Research in cloud computing, microservices architecture & AI applications',
      'Published papers on load balancing algorithms',
      'Cross-cultural tech leadership and international collaboration'
    ],
    zDistance: 6500,
    type: 'education',
    color: '#F3FF33',
  },
  {
    id: 'm5',
    year: '2021-2023',
    title: 'Digital Commerce Bank (Dijital Ticaret Bankası)',
    description: [
      'Senior Software Engineer - Core Banking Systems Team',
      'Architected microservices with .NET Core, Docker & Kubernetes',
      'Built high-availability payment processing systems (99.99% uptime)',
      'Implemented event-driven architecture with RabbitMQ & Kafka',
      'Led migration from monolith to microservices for critical modules',
      'Collaborated with PCI-DSS compliance and security teams'
    ],
    zDistance: 8500,
    type: 'work',
    color: '#FF33F3',
  },
  {
    id: 'm6',
    year: '2023-Present',
    title: 'Firisbe - Team Lead & Senior Software Engineer',
    description: [
      'Leading cross-functional team of 10+ engineers (Frontend, Backend, Mobile)',
      'Architecting and developing payment solutions: Payment Facilitator, Payment Gateway, SoftPOS, Digital Wallet',
      'Built scalable fintech infrastructure with React.js, Next.js, Java, Node.js, Express.js',
      'Designed event-driven payment processing systems with Kafka for high-throughput transactions',
      'Implemented secure payment flows with PostgreSQL and MongoDB for transaction management',
      'Established CI/CD pipelines, code review standards & comprehensive testing frameworks',
      'Mentoring junior developers and conducting technical interviews',
      'Tech Stack: React.js, Next.js, Java, Node.js, Express.js, PostgreSQL, MongoDB, Kafka'
    ],
    zDistance: 10500,
    type: 'work',
    color: '#00f3ff',
  },
];

// Core expertise - Technologies you have mastered through extensive professional use
export const CORE_SKILLS = [
  'React.js',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Java',
  'Express.js',
  'PostgreSQL',
  'MongoDB',
  'Kafka',
  'Payment Systems',
  'Microservices Architecture',
  'Team Leadership',
  'System Design'
];

// Professional experience - Technologies actively used in recent projects
export const PROFESSIONAL_SKILLS = [
  '.NET Core',
  'C#',
  'ASP.NET MVC',
  'NestJS',
  'Redux',
  'Material-UI',
  'Tailwind CSS',
  'MySQL',
  'Redis',
  'SQL Server',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'RabbitMQ',
  'RESTful APIs',
  'GraphQL',
  'Payment Gateway',
  'Payment Facilitator',
  'SoftPOS',
  'Digital Wallet',
  'CI/CD',
  'Jenkins',
  'GitHub Actions',
  'Agile/Scrum'
];

// Additional competencies - Solid working knowledge and experience
export const ADDITIONAL_SKILLS = [
  'Elasticsearch',
  'Nginx',
  'Event-Driven Architecture',
  'Distributed Systems',
  'Jest',
  'React Testing Library',
  'Unit Testing',
  'Integration Testing',
  'Code Review',
  'Clean Code',
  'SOLID Principles',
  'Design Patterns',
  'Mentoring',
  'Technical Interviews',
  'Project Planning',
  'Git',
  'Linux',
  'Performance Optimization',
  'Security Best Practices',
  'API Design',
  'Three.js',
  'HTML5/CSS3'
];

// All skills combined for display
export const SKILLS = [...CORE_SKILLS, ...PROFESSIONAL_SKILLS, ...ADDITIONAL_SKILLS];