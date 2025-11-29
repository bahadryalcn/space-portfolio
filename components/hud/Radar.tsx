import React from "react";

const Radar: React.FC = () => {
  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48">
      {/* Corner Brackets */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80"></div>
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80"></div>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80"></div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80"></div>

      {/* Main Radar Container */}
      <div className="w-full h-full border-2 border-cyan-500/50 bg-black/60 rounded-full relative overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.3)] backdrop-blur-sm">
        {/* Hexagonal Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,243,255,0.1) 10px, rgba(0,243,255,0.1) 11px),
                            repeating-linear-gradient(60deg, transparent, transparent 10px, rgba(0,243,255,0.1) 10px, rgba(0,243,255,0.1) 11px),
                            repeating-linear-gradient(120deg, transparent, transparent 10px, rgba(0,243,255,0.1) 10px, rgba(0,243,255,0.1) 11px)`,
          }}
        ></div>

        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400"></div>
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-cyan-400"></div>
          <div className="absolute inset-3 md:inset-4 border border-cyan-400/60 rounded-full"></div>
          <div className="absolute inset-6 md:inset-8 border border-cyan-400/40 rounded-full"></div>
          <div className="absolute inset-9 md:inset-12 border border-cyan-400/20 rounded-full"></div>
        </div>

        {/* Rotating Scanner */}
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite] origin-center">
          <div className="w-1/2 h-1/2 bg-gradient-to-tl from-cyan-500/50 via-cyan-500/20 to-transparent absolute top-0 left-0 origin-bottom-right rounded-tl-full"></div>
        </div>

        {/* Detection Blips */}
        <div className="absolute top-[35%] left-[60%] w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]"></div>
        <div
          className="absolute top-[55%] left-[25%] w-1 h-1 bg-yellow-400 rounded-full animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_6px_rgba(255,232,31,0.8)]"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-[70%] left-[70%] w-1 h-1 bg-green-400 rounded-full animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_6px_rgba(34,197,94,0.8)]"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_rgba(255,232,31,1)] border border-yellow-200"></div>

        {/* Cardinal Direction Label */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[8px] md:text-[10px] text-cyan-300 terminal-font tracking-widest bg-black/80 px-1.5 py-0.5 border border-cyan-500/30">
          N
        </div>

        {/* Screen Flicker Effect */}
        <div
          className="absolute inset-0 bg-cyan-500/5 animate-[pulse_0.1s_ease-in-out_infinite] opacity-50"
          style={{ animationDelay: "0.05s" }}
        ></div>
      </div>

      {/* Technical Labels */}
      <div className="absolute -bottom-5 left-0 right-0 text-center">
        <div className="text-[8px] md:text-[10px] text-cyan-400 terminal-font tracking-wider uppercase opacity-80">
          Sensor Array
        </div>
      </div>
      <div className="absolute -top-5 left-0 right-0 text-center hidden md:block">
        <div className="text-[8px] text-cyan-500/60 terminal-font tracking-widest uppercase">
          Range: 50km
        </div>
      </div>
    </div>
  );
};

export default Radar;
