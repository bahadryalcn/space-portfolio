import React, { useState, useEffect, useRef } from 'react';
import GameScene from './components/GameScene';
import { GameState, InputState } from './types';
import { MILESTONES, SKILLS, CORE_SKILLS, PROFESSIONAL_SKILLS, ADDITIONAL_SKILLS, GAME_CONFIG } from './constants';
import { audioService } from './services/audioService';
import { VolumeX, Volume2, Pause, Play, RotateCcw, Mail, Linkedin, Github, Phone, Zap, Briefcase, Wrench } from 'lucide-react';

const App: React.FC = () => {
  // --- STATE ---
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    shield: 100,
    distance: 0,
    currentMilestoneIndex: -1,
    isGameOver: false,
    gamePhase: 'start',
    speed: 0,
    isPaused: false,
  });
  
  // UI States
  const [milestoneExpanded, setMilestoneExpanded] = useState(false);
  const [hoveredMilestoneIndex, setHoveredMilestoneIndex] = useState<number | null>(null);
  const [scrollPos, setScrollPos] = useState(0); 
  const [isHovered, setIsHovered] = useState(false);
  
  // New Controls States
  const [isMuted, setIsMuted] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Key to force remount/restart

  // Refs for high-frequency updates
  const gameStateRef = useRef(gameState);
  const inputRef = useRef<InputState>({ up: false, down: false, left: false, right: false, fire: false });

  // --- SYNC STATE ---
  const updateGameState = (updates: Partial<GameState>) => {
    const newState = { ...gameStateRef.current, ...updates };
    gameStateRef.current = newState;
    setGameState(newState); 
  };
  
  useEffect(() => {
    if (gameState.currentMilestoneIndex !== -1) {
      setMilestoneExpanded(true);
    }
  }, [gameState.currentMilestoneIndex]);

  // --- ENDING ANIMATION LOOP ---
  useEffect(() => {
    if (gameState.gamePhase !== 'ending') return;

    let animFrame: number;
    const animateScroll = () => {
      if (!isHovered && scrollPos < 100 && !gameState.isPaused) {
        setScrollPos(prev => Math.min(prev + 0.04, 100)); 
      }
      animFrame = requestAnimationFrame(animateScroll);
    };
    animFrame = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animFrame);
  }, [gameState.gamePhase, isHovered, scrollPos, gameState.isPaused]);

  // --- INPUT HANDLING ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp': inputRef.current.up = true; break;
        case 'ArrowDown': inputRef.current.down = true; break;
        case 'ArrowLeft': inputRef.current.left = true; break;
        case 'ArrowRight': inputRef.current.right = true; break;
        case 'Space': inputRef.current.fire = true; break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowUp': inputRef.current.up = false; break;
        case 'ArrowDown': inputRef.current.down = false; break;
        case 'ArrowLeft': inputRef.current.left = false; break;
        case 'ArrowRight': inputRef.current.right = false; break;
        case 'Space': inputRef.current.fire = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = async () => {
    await audioService.init();
    updateGameState({ gamePhase: 'playing', distance: 0, score: 0, shield: 100, isPaused: false });
  };

  // --- CONTROL FUNCTIONS ---
  const handleRestart = () => {
    // Reset audio service
    audioService.reset();

    // Remount game component
    setGameKey(prev => prev + 1);
    setScrollPos(0);
    updateGameState({
        score: 0,
        shield: 100,
        distance: 0,
        currentMilestoneIndex: -1,
        isGameOver: false,
        gamePhase: 'start',
        speed: 0,
        isPaused: false
    });
  };

  const togglePause = () => {
    updateGameState({ isPaused: !gameState.isPaused });
  };

  const toggleMute = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
  };

  const toggleInfo = () => {
    setShowInfoModal(!showInfoModal);
    // Auto-pause when info modal is opened in game
    if (gameState.gamePhase === 'playing' && !showInfoModal) {
        updateGameState({ isPaused: true });
    }
  };

  // --- RENDER HELPERS ---
  const displayMilestoneIndex = hoveredMilestoneIndex !== null ? hoveredMilestoneIndex : gameState.currentMilestoneIndex;
  const displayMilestone = MILESTONES[displayMilestoneIndex];
  const isCardVisible = displayMilestone && (hoveredMilestoneIndex !== null || milestoneExpanded || displayMilestoneIndex === gameState.currentMilestoneIndex);
  const isCardExpanded = hoveredMilestoneIndex !== null || milestoneExpanded;
  const progress = Math.min(100, (gameState.distance / GAME_CONFIG.TOTAL_DISTANCE) * 100);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none text-white crt">
      {/* 3D SCENE - Key forces remount on restart */}
      <GameScene 
        key={gameKey}
        input={inputRef} 
        gameStateRef={gameStateRef} 
        onGameUpdate={updateGameState} 
      />

      {/* --- UI LAYERS --- */}

      {/* 1. START SCREEN */}
      {gameState.gamePhase === 'start' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <h1 className="text-6xl md:text-8xl font-bold text-yellow-400 tracking-widest star-wars-font mb-4 text-center drop-shadow-[0_0_10px_rgba(255,232,31,0.8)]">
            THE CAREER RUN
          </h1>
          <div className="max-w-lg p-8 border-2 border-cyan-400 bg-black/80 rounded-lg text-center shadow-[0_0_30px_rgba(0,243,255,0.3)]">
            <h2 className="text-2xl text-cyan-400 hud-font mb-4">PILOT PROFILE: BAHADIR HALIL YALCIN</h2>
            <p className="text-gray-300 terminal-font mb-6 text-sm md:text-base">
              MISSION: Navigate the career timeline. Collect data from milestones.<br/>
              HOSTILES: Bugs, Deadlines, & Legacy Code (Drones).<br/>
              CONTROLS: Arrows to fly. SPACE to fire.<br/>
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded text-xl transition-all duration-200 animate-pulse hud-font uppercase"
            >
              Initiate Launch Sequence
            </button>
          </div>
        </div>
      )}

      {/* 2. HUD (IN GAME) */}
      {gameState.gamePhase === 'playing' && (
        <div className="absolute inset-0 z-40 pointer-events-none p-4 md:p-8 flex flex-col justify-between">
          
          {/* Top Bar */}
          <div className="flex justify-between items-start">
            <div className="w-48 h-32 border border-cyan-500/50 bg-cyan-900/20 rounded-br-3xl p-2 relative overflow-hidden">
              <div className="text-xs text-cyan-300 terminal-font">RADAR: ACTIVE</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                 <div className="w-20 h-20 border border-cyan-400 rounded-full animate-[spin_4s_linear_infinite] border-t-transparent"></div>
              </div>
              <div className="mt-2 text-xs text-green-400">SYS: ONLINE</div>
            </div>

            <div className="text-center">
              <div className="text-yellow-400 text-4xl font-bold star-wars-font tracking-widest drop-shadow-md">
                {gameState.score.toString().padStart(6, '0')}
              </div>
              <div className="text-cyan-500 text-sm tracking-widest hud-font">POINTS</div>
              {gameState.isPaused && <div className="text-red-500 text-xl animate-pulse mt-2">SYSTEM PAUSED</div>}
            </div>

            <div className="w-48 text-right">
              <div className="flex flex-col items-end mb-2">
                <span className="text-cyan-400 text-xs mb-1 terminal-font">SHIELD INTEGRITY</span>
                <div className="w-full h-4 bg-gray-800 border border-cyan-500 skew-x-[-15deg]">
                  <div 
                    className={`h-full transition-all duration-300 ${gameState.shield < 30 ? 'bg-red-500 animate-pulse' : 'bg-cyan-400'}`}
                    style={{ width: `${gameState.shield}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-yellow-400 text-xs mb-1 terminal-font">DISTANCE TO BASE</span>
                <div className="w-full h-2 bg-gray-800 border border-yellow-500 skew-x-[-15deg]">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Vert Timeline */}
          <div className="absolute left-4 md:left-8 top-1/3 transform -translate-y-1/3 flex flex-col items-center pointer-events-auto">
             <div className="h-8 w-[2px] bg-cyan-900/50"></div>
             {MILESTONES.map((m, idx) => {
                const isCompleted = gameState.currentMilestoneIndex > idx;
                const isActive = gameState.currentMilestoneIndex === idx;
                const isHovered = hoveredMilestoneIndex === idx;
                
                return (
                  <div key={m.id} className="flex flex-col items-center relative group">
                    <div 
                       onMouseEnter={() => setHoveredMilestoneIndex(idx)}
                       onMouseLeave={() => setHoveredMilestoneIndex(null)}
                       className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 transition-all duration-300 cursor-pointer z-10 
                         ${isActive ? 'bg-yellow-400 border-yellow-200 scale-125 shadow-[0_0_15px_rgba(255,232,31,0.8)] animate-pulse' : ''}
                         ${isCompleted ? 'bg-cyan-500 border-cyan-300' : ''}
                         ${!isActive && !isCompleted ? 'bg-black border-gray-700 hover:border-cyan-500' : ''}
                       `}
                    ></div>
                    {idx < MILESTONES.length - 1 && (
                      <div className={`w-[2px] h-8 md:h-12 ${isCompleted ? 'bg-cyan-500' : 'bg-gray-800'}`}></div>
                    )}
                    <div className={`absolute left-8 md:left-10 top-0 whitespace-nowrap bg-black/80 px-2 py-1 border-l-2 border-cyan-500 text-[10px] terminal-font transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                      {m.year}
                    </div>
                  </div>
                );
             })}
             <div className="h-8 w-[2px] bg-gray-800"></div>
          </div>

          {/* Milestone Card */}
          {isCardVisible && displayMilestone && (
             <div 
               onClick={() => setMilestoneExpanded(!milestoneExpanded)}
               className={`absolute top-32 right-4 md:right-12 bg-black/90 border-l-4 p-4 transform transition-all duration-300 ease-out cursor-pointer hover:bg-cyan-900/30 group pointer-events-auto 
                 ${hoveredMilestoneIndex !== null ? 'border-yellow-400' : 'border-cyan-400'}
                 ${isCardExpanded ? 'w-80 md:w-96' : 'w-64'}`}
             >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-xs hud-font uppercase mb-1 tracking-widest ${hoveredMilestoneIndex !== null ? 'text-yellow-400' : 'text-cyan-400'}`}>
                      {hoveredMilestoneIndex !== null ? 'ARCHIVE DATA' : 'DATA LOG'}: {displayMilestone.year}
                    </h3>
                    <h2 className="text-white font-bold text-lg star-wars-font group-hover:text-yellow-300 transition-colors">
                      {displayMilestone.title}
                    </h2>
                  </div>
                  <div className="text-cyan-400 text-xl font-bold">
                    {isCardExpanded ? '−' : '+'}
                  </div>
                </div>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isCardExpanded ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                  <ul className="text-sm text-gray-300 terminal-font space-y-2 border-t border-cyan-500/30 pt-3">
                    {displayMilestone.description.map((desc, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-cyan-500 mr-2">»</span> {desc}
                      </li>
                    ))}
                  </ul>
                </div>
             </div>
          )}

          {/* Mobile Controls */}
          <div className="md:hidden flex justify-between items-end pb-20 px-4 pointer-events-auto">
            <div className="grid grid-cols-3 gap-2 w-32 h-32">
               <div></div>
               <button 
                 className="bg-cyan-500/20 border border-cyan-400 active:bg-cyan-400/60 rounded"
                 onTouchStart={() => (inputRef.current.up = true)} onTouchEnd={() => (inputRef.current.up = false)}
               >▲</button>
               <div></div>
               <button 
                 className="bg-cyan-500/20 border border-cyan-400 active:bg-cyan-400/60 rounded"
                 onTouchStart={() => (inputRef.current.left = true)} onTouchEnd={() => (inputRef.current.left = false)}
               >◀</button>
               <button 
                 className="bg-cyan-500/20 border border-cyan-400 active:bg-cyan-400/60 rounded"
                 onTouchStart={() => (inputRef.current.down = true)} onTouchEnd={() => (inputRef.current.down = false)}
               >▼</button>
               <button 
                 className="bg-cyan-500/20 border border-cyan-400 active:bg-cyan-400/60 rounded"
                 onTouchStart={() => (inputRef.current.right = true)} onTouchEnd={() => (inputRef.current.right = false)}
               >▶</button>
            </div>
            <button 
              className="w-24 h-24 rounded-full border-4 border-red-500 bg-red-500/20 active:bg-red-500/60 flex items-center justify-center text-red-400 font-bold tracking-widest"
              onTouchStart={() => (inputRef.current.fire = true)} onTouchEnd={() => (inputRef.current.fire = false)}
            >
              FIRE
            </button>
          </div>
        </div>
      )}

      {/* 3. ENDING CRAWL (JS CONTROLLED) */}
      {gameState.gamePhase === 'ending' && (
        <div className="absolute inset-0 z-50 flex justify-center star-wars-container">
           <div 
              className="absolute w-[90%] max-w-5xl text-yellow-400 font-bold text-center leading-relaxed pointer-events-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                top: '0',
                transform: `rotateX(15deg) translateZ(0) translateY(${100 - (scrollPos * 2.8)}vh)`,
                transition: isHovered ? 'transform 0.5s ease-out' : 'none' 
              }}
           >
              <p className="mb-16 text-6xl md:text-9xl star-wars-font tracking-tighter">MISSION ACCOMPLISHED</p>
              <p className="text-4xl md:text-7xl mb-12 tracking-wide">Bahadır Halil YALCIN</p>
              <p className="text-2xl md:text-4xl mb-16 terminal-font text-justify leading-normal md:leading-relaxed px-4 md:px-0">
                A seasoned Senior Software Engineer and Team Lead specializing in payment systems and fintech solutions.
                Architect of Payment Gateways, Master of Distributed Systems, and Champion of Scalable Microservices.
                8+ years navigating the galaxy of enterprise software with expertise in React, Java, and event-driven architectures.
              </p>
              <p className="text-4xl mb-6 star-wars-font">CORE COMPETENCIES</p>
              <div className="flex flex-wrap justify-center gap-4 mb-8 terminal-font text-2xl md:text-4xl text-yellow-400">
                {CORE_SKILLS.map(s => <span key={s} className="font-bold">[{s}]</span>)}
              </div>

              <p className="text-3xl mb-4 star-wars-font mt-12">PROFESSIONAL ARSENAL</p>
              <div className="flex flex-wrap justify-center gap-3 mb-16 terminal-font text-lg md:text-2xl text-cyan-300">
                {PROFESSIONAL_SKILLS.map(s => <span key={s}>[{s}]</span>)}
              </div>
              
              {/* CONTACT INFO - Bottom of Scroll */}
              <div className="mt-32 pb-64">
                <p className="text-4xl mb-6 star-wars-font animate-pulse">CONTACT CHANNEL</p>
                <div className="text-xl md:text-2xl terminal-font text-white leading-loose cursor-pointer">
                  <a href="mailto:bahadrhllyalcn@gmail.com" className="flex items-center gap-3 hover:text-cyan-400 transition-colors mb-3">
                    <Mail size={28} className="flex-shrink-0" />
                    <span>bahadrhllyalcn@gmail.com</span>
                  </a>
                  <a href="https://www.linkedin.com/in/bahadryalcn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-cyan-400 transition-colors mb-3">
                    <Linkedin size={28} className="flex-shrink-0" />
                    <span>linkedin.com/in/bahadryalcn</span>
                  </a>
                  <a href="https://github.com/bahadryalcn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-cyan-400 transition-colors mb-3">
                    <Github size={28} className="flex-shrink-0" />
                    <span>github.com/bahadryalcn</span>
                  </a>
                  <a href="tel:+905320629756" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                    <Phone size={28} className="flex-shrink-0" />
                    <span>+90 532 062 97 56</span>
                  </a>
                </div>
                <p className="text-lg md:text-xl text-gray-500 mt-12">The Force is strong with this one.</p>
              </div>
           </div>

           <div className="absolute right-4 top-1/4 h-1/2 w-8 z-50 flex flex-col items-center justify-center bg-black/50 border border-cyan-900/50 rounded-full py-4 backdrop-blur-sm pointer-events-auto">
              <div className="text-cyan-400 text-xs font-bold mb-2 -rotate-90 whitespace-nowrap tracking-widest">TIMELINE</div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={scrollPos} 
                onChange={(e) => {
                   setScrollPos(Number(e.target.value));
                   setIsHovered(true); 
                }}
                onMouseLeave={() => setIsHovered(false)} 
                className="h-full -rotate-180 appearance-none bg-transparent w-2"
                style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
              />
           </div>
        </div>
      )}

      {/* --- 4. CONTROL PANEL (Bottom Right) --- */}
      <div className="absolute bottom-4 right-4 z-[60] flex flex-col gap-2 items-end pointer-events-auto">
        <div className="flex gap-2">
          <button
            onClick={toggleMute}
            className="w-10 h-10 bg-gray-900/80 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-900/50 flex items-center justify-center"
            title="Mute Audio"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          {gameState.gamePhase !== 'start' && (
             <button
               onClick={togglePause}
               className="w-10 h-10 bg-gray-900/80 border border-cyan-500 text-cyan-400 rounded hover:bg-cyan-900/50 flex items-center justify-center"
               title={gameState.isPaused ? "Resume" : "Pause"}
             >
               {gameState.isPaused ? <Play size={20} /> : <Pause size={20} />}
             </button>
          )}

          <button
            onClick={handleRestart}
            className="w-10 h-10 bg-gray-900/80 border border-yellow-500 text-yellow-400 rounded hover:bg-yellow-900/50 flex items-center justify-center"
            title="Restart Mission"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        
        <button 
          onClick={toggleInfo}
          className="px-4 py-2 bg-cyan-900/80 border border-cyan-400 text-cyan-300 rounded terminal-font text-sm hover:bg-cyan-800/80 tracking-widest"
        >
          [ INFO_DATA ]
        </button>
      </div>

      {/* --- 5. INFO MODAL OVERLAY --- */}
      {showInfoModal && (
        <div className="absolute inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
           <div className="w-full max-w-3xl bg-gray-900 border-2 border-cyan-500 rounded shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-cyan-500/30 bg-cyan-900/20">
                 <h2 className="text-2xl star-wars-font text-yellow-400">PILOT DOSSIER</h2>
                 <button onClick={toggleInfo} className="text-cyan-400 hover:text-white text-2xl">✖</button>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto terminal-font text-gray-300 custom-scrollbar">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div>
                       <h3 className="text-cyan-400 text-xl mb-4 border-b border-cyan-500/30 pb-2">IDENTITY</h3>
                       <p><span className="text-gray-500">NAME:</span> Bahadır Halil YALCIN</p>
                       <p><span className="text-gray-500">CLASS:</span> Senior Software Engineer</p>
                       <p><span className="text-gray-500">RANK:</span> Team Lead</p>
                       <p><span className="text-gray-500">BASE:</span> Istanbul, Turkey (Remote Capable)</p>
                       <p><span className="text-gray-500">EDUCATION:</span> M.Sc. Software Engineering</p>
                       <p><span className="text-gray-500">EXPERIENCE:</span> 8+ Years</p>
                    </div>
                    <div>
                       <h3 className="text-cyan-400 text-xl mb-4 border-b border-cyan-500/30 pb-2">CONTACT</h3>
                       <p className="mb-2">
                         <a href="mailto:bahadrhllyalcn@gmail.com" className="hover:text-white flex items-center gap-2">
                           <Mail size={16} className="inline" /> bahadrhllyalcn@gmail.com
                         </a>
                       </p>
                       <p className="mb-2">
                         <a href="https://www.linkedin.com/in/bahadryalcn" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2">
                           <Linkedin size={16} className="inline" /> linkedin.com/in/bahadryalcn
                         </a>
                       </p>
                       <p className="mb-2">
                         <a href="https://github.com/bahadryalcn" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-2">
                           <Github size={16} className="inline" /> github.com/bahadryalcn
                         </a>
                       </p>
                       <p>
                         <a href="tel:+905320629756" className="hover:text-white flex items-center gap-2">
                           <Phone size={16} className="inline" /> +90 532 062 97 56
                         </a>
                       </p>
                    </div>
                 </div>

                 <div className="mt-8">
                    <h3 className="text-cyan-400 text-xl mb-4 border-b border-cyan-500/30 pb-2">MISSION BRIEF</h3>
                    <p className="mb-4 leading-relaxed">
                       Senior Software Engineer and Team Lead with 8+ years of professional experience specializing in
                       payment systems, full-stack development, and microservices architecture. Currently leading a
                       cross-functional team of 10+ engineers at Firisbe, architecting fintech payment solutions.
                    </p>
                    <p className="mb-4 leading-relaxed">
                       Proven track record across multiple domains: <span className="text-cyan-300">fintech payment systems</span> (Firisbe - Payment Gateway, Payment Facilitator, SoftPOS, Digital Wallet),
                       <span className="text-cyan-300"> core banking infrastructure</span> (Digital Commerce Bank - microservices with 99.99% uptime),
                       and <span className="text-cyan-300">gaming</span> (SpecialWar MMO FPS - 2M+ users). Master's degree in Software Engineering from Chang'an University
                       (China Government Scholarship recipient).
                    </p>
                    <p className="mb-4 leading-relaxed">
                       <span className="text-cyan-400 font-semibold">Core Tech Stack:</span> React.js, Next.js, TypeScript, Node.js, Java, Express.js, PostgreSQL, MongoDB, Kafka, Payment Systems
                    </p>

                    <h3 className="text-cyan-400 text-lg mt-6 mb-3 border-b border-cyan-500/30 pb-2">KEY ACHIEVEMENTS</h3>
                    <ul className="space-y-2 mb-4">
                       <li className="flex items-start">
                          <span className="text-cyan-500 mr-2">»</span>
                          <span>Architected and developed complete payment ecosystem: Payment Gateway, Payment Facilitator, SoftPOS, and Digital Wallet solutions</span>
                       </li>
                       <li className="flex items-start">
                          <span className="text-cyan-500 mr-2">»</span>
                          <span>Built high-throughput payment processing systems using Kafka for event-driven architecture</span>
                       </li>
                       <li className="flex items-start">
                          <span className="text-cyan-500 mr-2">»</span>
                          <span>Designed microservices for core banking systems at Digital Commerce Bank with 99.99% uptime</span>
                       </li>
                       <li className="flex items-start">
                          <span className="text-cyan-500 mr-2">»</span>
                          <span>Founded and scaled SpecialWar MMO FPS game to 2M+ users with 50K+ daily active players</span>
                       </li>
                       <li className="flex items-start">
                          <span className="text-cyan-500 mr-2">»</span>
                          <span>Leading cross-functional team of 10+ engineers with focus on code quality and best practices</span>
                       </li>
                       <li className="flex items-start">
                          <span className="text-cyan-500 mr-2">»</span>
                          <span>China Government Scholarship recipient for Master's degree in Software Engineering</span>
                       </li>
                    </ul>

                    <h3 className="text-cyan-400 text-lg mt-6 mb-3 border-b border-cyan-500/30 pb-2">TECHNICAL ARSENAL</h3>

                    <div className="mb-4">
                       <h4 className="text-yellow-400 text-sm mb-2 font-bold flex items-center gap-2">
                         <Zap size={16} /> CORE EXPERTISE
                       </h4>
                       <div className="flex flex-wrap gap-2">
                          {CORE_SKILLS.map(s => (
                             <span key={s} className="bg-yellow-900/40 border-2 border-yellow-500/50 px-3 py-1 rounded text-xs text-yellow-200 font-semibold">
                                {s}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div className="mb-4">
                       <h4 className="text-cyan-400 text-sm mb-2 font-bold flex items-center gap-2">
                         <Briefcase size={16} /> PROFESSIONAL SKILLS
                       </h4>
                       <div className="flex flex-wrap gap-2">
                          {PROFESSIONAL_SKILLS.map(s => (
                             <span key={s} className="bg-cyan-900/50 border border-cyan-500/40 px-2 py-1 rounded text-xs text-cyan-200">
                                {s}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div>
                       <h4 className="text-gray-400 text-sm mb-2 font-bold flex items-center gap-2">
                         <Wrench size={16} /> ADDITIONAL COMPETENCIES
                       </h4>
                       <div className="flex flex-wrap gap-2">
                          {ADDITIONAL_SKILLS.map(s => (
                             <span key={s} className="bg-gray-800/50 border border-gray-600/30 px-2 py-1 rounded text-xs text-gray-300">
                                {s}
                             </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-cyan-500/30 bg-black/40 text-center">
                 <button onClick={toggleInfo} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded">
                    CLOSE DATA PAD
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;