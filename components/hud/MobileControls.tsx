import React from "react";
import { InputState } from "../../types";

interface MobileControlsProps {
  inputRef: React.MutableRefObject<InputState>;
}

const MobileControls: React.FC<MobileControlsProps> = ({ inputRef }) => {
  return (
    <div className="md:hidden w-full max-w-lg mx-auto px-4 pb-safe">
      {/* Header Label */}
      <div className="text-center mb-2">
        <div className="text-cyan-400 text-[10px] tracking-widest hud-font uppercase opacity-70 inline-block px-3 py-1 border border-cyan-500/20 bg-black/40 backdrop-blur-sm">
          ⚡ Pilot Controls ⚡
        </div>
      </div>

      <div className="flex justify-between items-end pointer-events-auto relative">
        {/* Background Panel */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm border-t border-cyan-500/10 -mx-4 -mb-4"></div>

        {/* D-Pad Control System */}
        <div className="relative z-10">
          <div className="text-cyan-400/60 text-[8px] terminal-font tracking-wider mb-1 text-center">
            NAVIGATION
          </div>

          <div className="grid grid-cols-3 gap-2 w-40 h-40 relative">
            {/* D-Pad Outer Glow Ring */}
            <div className="absolute inset-0 bg-cyan-900/5 rounded-full border border-cyan-500/20 transform scale-110 blur-sm"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 to-transparent rounded-full"></div>

            {/* Empty Corner */}
            <div></div>

            {/* UP Button */}
            <button
              className="relative bg-gradient-to-b from-cyan-900/60 to-cyan-900/40 border-2 border-cyan-400/60 active:border-cyan-300 active:bg-cyan-400/70 rounded-t-2xl backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all active:scale-95 group overflow-hidden"
              style={{
                clipPath:
                  "polygon(20% 0%, 80% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%)",
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                inputRef.current.up = true;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                inputRef.current.up = false;
              }}
            >
              {/* Ripple Effect */}
              <div className="absolute inset-0 bg-cyan-400/0 group-active:bg-cyan-400/30 transition-colors duration-150"></div>
              <div className="relative flex items-center justify-center h-full">
                <span className="text-cyan-300 text-2xl font-bold">▲</span>
              </div>
              <div className="absolute bottom-1 left-0 right-0 text-center text-[6px] text-cyan-500/70 terminal-font">
                UP
              </div>
            </button>

            {/* Empty Corner */}
            <div></div>

            {/* LEFT Button */}
            <button
              className="relative bg-gradient-to-r from-cyan-900/60 to-cyan-900/40 border-2 border-cyan-400/60 active:border-cyan-300 active:bg-cyan-400/70 rounded-l-2xl backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all active:scale-95 group overflow-hidden"
              style={{
                clipPath:
                  "polygon(0% 20%, 15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 80%)",
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                inputRef.current.left = true;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                inputRef.current.left = false;
              }}
            >
              <div className="absolute inset-0 bg-cyan-400/0 group-active:bg-cyan-400/30 transition-colors duration-150"></div>
              <div className="relative flex items-center justify-center h-full">
                <span className="text-cyan-300 text-2xl font-bold">◀</span>
              </div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[6px] text-cyan-500/70 terminal-font -rotate-90">
                LEFT
              </div>
            </button>

            {/* Center Indicator */}
            <div className="bg-cyan-900/20 rounded-full border-2 border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
              <div className="w-3 h-3 bg-cyan-500/50 rounded-full animate-pulse"></div>
              <div
                className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(0,243,255,0.2),transparent)] animate-spin"
                style={{ animationDuration: "3s" }}
              ></div>
            </div>

            {/* RIGHT Button */}
            <button
              className="relative bg-gradient-to-l from-cyan-900/60 to-cyan-900/40 border-2 border-cyan-400/60 active:border-cyan-300 active:bg-cyan-400/70 rounded-r-2xl backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all active:scale-95 group overflow-hidden"
              style={{
                clipPath:
                  "polygon(0% 0%, 85% 0%, 100% 20%, 100% 80%, 85% 100%, 0% 100%)",
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                inputRef.current.right = true;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                inputRef.current.right = false;
              }}
            >
              <div className="absolute inset-0 bg-cyan-400/0 group-active:bg-cyan-400/30 transition-colors duration-150"></div>
              <div className="relative flex items-center justify-center h-full">
                <span className="text-cyan-300 text-2xl font-bold">▶</span>
              </div>
              <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[6px] text-cyan-500/70 terminal-font rotate-90">
                RIGHT
              </div>
            </button>

            {/* Empty Corner */}
            <div></div>

            {/* DOWN Button */}
            <button
              className="relative bg-gradient-to-t from-cyan-900/60 to-cyan-900/40 border-2 border-cyan-400/60 active:border-cyan-300 active:bg-cyan-400/70 rounded-b-2xl backdrop-blur-sm shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all active:scale-95 group overflow-hidden"
              style={{
                clipPath:
                  "polygon(0% 0%, 100% 0%, 100% 85%, 80% 100%, 20% 100%, 0% 85%)",
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                inputRef.current.down = true;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                inputRef.current.down = false;
              }}
            >
              <div className="absolute inset-0 bg-cyan-400/0 group-active:bg-cyan-400/30 transition-colors duration-150"></div>
              <div className="relative flex items-center justify-center h-full">
                <span className="text-cyan-300 text-2xl font-bold">▼</span>
              </div>
              <div className="absolute top-1 left-0 right-0 text-center text-[6px] text-cyan-500/70 terminal-font">
                DOWN
              </div>
            </button>

            {/* Empty Corner */}
            <div></div>
          </div>
        </div>

        {/* Fire Button System */}
        <div className="relative z-10">
          <div className="text-red-400/60 text-[8px] terminal-font tracking-wider mb-1 text-center">
            WEAPON-SYS
          </div>

          <button
            className="relative w-28 h-28 rounded-full border-4 border-red-500/80 bg-gradient-to-br from-red-900/40 to-red-900/60 active:from-red-500/80 active:to-red-600/80 flex items-center justify-center backdrop-blur-sm shadow-[0_0_25px_rgba(239,68,68,0.4)] active:shadow-[0_0_40px_rgba(239,68,68,0.8)] transition-all active:scale-95 group overflow-hidden"
            onTouchStart={(e) => {
              e.preventDefault();
              inputRef.current.fire = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              inputRef.current.fire = false;
            }}
          >
            {/* Hexagonal Inner Pattern */}
            <div
              className="absolute inset-4 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(239,68,68,0.1) 10px, rgba(239,68,68,0.1) 11px),
                                repeating-linear-gradient(60deg, transparent, transparent 10px, rgba(239,68,68,0.1) 10px, rgba(239,68,68,0.1) 11px),
                                repeating-linear-gradient(120deg, transparent, transparent 10px, rgba(239,68,68,0.1) 10px, rgba(239,68,68,0.1) 11px)`,
              }}
            ></div>

            {/* Charge Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/0 group-active:from-red-500/40 to-transparent transition-all duration-200"></div>

            {/* Rotating Reticle */}
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "4s" }}
            >
              <div className="absolute inset-8 border-2 border-red-400/30 rounded-full"></div>
              <div className="absolute top-0 left-1/2 w-[2px] h-8 bg-red-400/50 transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-[2px] h-8 bg-red-400/50 transform -translate-x-1/2"></div>
            </div>

            {/* Center Label */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="star-wars-font text-lg text-red-300 font-bold tracking-widest group-active:text-white transition-colors">
                FIRE
              </span>
              <span className="text-[8px] text-red-500/70 terminal-font mt-1">
                [ SPACE ]
              </span>
            </div>

            {/* Pulse Ring on Active */}
            <div className="absolute inset-0 rounded-full border-2 border-red-400/0 group-active:border-red-400/60 group-active:animate-ping"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
