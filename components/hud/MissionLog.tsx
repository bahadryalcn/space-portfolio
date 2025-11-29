import React from "react";
import { Milestone } from "../../types";

interface MissionLogProps {
  milestones: Milestone[];
  currentMilestoneIndex: number;
  hoveredMilestoneIndex: number | null;
  onHover: (index: number | null) => void;
}

const MissionLog: React.FC<MissionLogProps> = ({
  milestones,
  currentMilestoneIndex,
  hoveredMilestoneIndex,
  onHover,
}) => {
  return (
    <>
      {/* Desktop/Tablet Vertical Timeline */}
      <div className="hidden md:flex flex-col items-center relative">
        {/* Header with Corner Brackets */}
        <div className="relative mb-3">
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-cyan-400/60"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-cyan-400/60"></div>
          <div className="text-cyan-400 text-[10px] tracking-[0.3em] hud-font uppercase border border-cyan-500/30 px-3 py-1 bg-black/60 backdrop-blur-sm">
            Nav Computer
          </div>
        </div>

        {/* Connecting Line to Timeline */}
        <div className="h-6 w-[2px] bg-gradient-to-b from-cyan-500/50 to-cyan-900/50"></div>

        {/* Holographic Scanline Overlay */}
        <div className="absolute top-16 bottom-0 w-full pointer-events-none">
          <div
            className="h-full w-full opacity-20 animate-[scan_3s_linear_infinite]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,243,255,0.3) 50%, transparent 100%)",
              backgroundSize: "100% 50px",
            }}
          ></div>
        </div>

        <div className="flex flex-col gap-0 relative">
          {milestones.map((m, idx) => {
            const isCompleted = currentMilestoneIndex > idx;
            const isActive = currentMilestoneIndex === idx;
            const isHovered = hoveredMilestoneIndex === idx;
            const isPast = currentMilestoneIndex > idx;

            return (
              <div
                key={m.id}
                className="flex flex-col items-center relative group"
              >
                {/* Hexagonal Milestone Marker */}
                <div
                  onMouseEnter={() => onHover(idx)}
                  onMouseLeave={() => onHover(null)}
                  className={`relative w-5 h-5 md:w-6 md:h-6 cursor-pointer z-10 transition-all duration-300
                       ${isActive ? "scale-150" : ""}
                       ${isHovered ? "scale-125" : ""}`}
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                  }}
                >
                  {/* Hexagonal Background */}
                  <div
                    className={`w-full h-full transition-all duration-300 ${
                      isActive
                        ? "bg-yellow-400 shadow-[0_0_20px_rgba(255,232,31,0.9)] animate-pulse"
                        : isCompleted
                        ? "bg-cyan-500 shadow-[0_0_12px_rgba(0,243,255,0.7)]"
                        : "bg-gray-800 border border-gray-600 hover:bg-cyan-900 hover:border-cyan-500"
                    }`}
                  ></div>

                  {/* Inner Glow Ring */}
                  {(isActive || isCompleted) && (
                    <div
                      className="absolute inset-0.5"
                      style={{
                        clipPath:
                          "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                      }}
                    >
                      <div
                        className={`w-full h-full ${
                          isActive ? "bg-yellow-200/50" : "bg-cyan-300/30"
                        }`}
                      ></div>
                    </div>
                  )}

                  {/* Rotating Glow for Active */}
                  {isActive && (
                    <div
                      className="absolute -inset-2 animate-spin"
                      style={{ animationDuration: "3s" }}
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            "conic-gradient(from 0deg, transparent, rgba(255,232,31,0.4), transparent)",
                          clipPath:
                            "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Connecting Line with Data Flow Animation */}
                {idx < milestones.length - 1 && (
                  <div className="relative w-[2px] h-8 md:h-10">
                    {/* Base Line */}
                    <div
                      className={`absolute inset-0 ${
                        isCompleted
                          ? "bg-cyan-500 shadow-[0_0_8px_rgba(0,243,255,0.6)]"
                          : "bg-gray-800"
                      }`}
                    ></div>

                    {/* Animated Data Flow */}
                    {isPast && (
                      <div
                        className="absolute inset-0 w-full animate-[flow_2s_linear_infinite]"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(0,243,255,0.8) 50%, transparent 100%)",
                          backgroundSize: "100% 20px",
                        }}
                      ></div>
                    )}
                  </div>
                )}

                {/* Enhanced Tooltip Label */}
                <div
                  className={`absolute left-8 md:left-10 top-0 whitespace-nowrap bg-black/95 backdrop-blur-md px-4 py-2 border-l-4 text-xs terminal-font transition-all duration-300 transform shadow-[0_0_15px_rgba(0,0,0,0.8)] ${
                    isHovered
                      ? `opacity-100 translate-x-0 ${
                          isActive ? "border-yellow-400" : "border-cyan-400"
                        }`
                      : "opacity-0 -translate-x-4 pointer-events-none border-cyan-500"
                  }`}
                >
                  {/* Tooltip Corner Brackets */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/50"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/50"></div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold ${
                        isActive ? "text-yellow-400" : "text-cyan-400"
                      }`}
                    >
                      {m.year}
                    </span>
                    <span className="text-gray-300">{m.title}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Connector */}
        <div className="h-6 w-[2px] bg-gradient-to-b from-cyan-900/50 to-transparent"></div>
      </div>

      {/* Mobile Horizontal Timeline */}
      <div className="md:hidden flex flex-col items-center w-full px-2">
        <div className="text-cyan-400 text-[8px] tracking-widest hud-font uppercase mb-2 opacity-80">
          Mission Archive
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-start scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
          {milestones.map((m, idx) => {
            const isCompleted = currentMilestoneIndex > idx;
            const isActive = currentMilestoneIndex === idx;

            return (
              <div key={m.id} className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onHover(idx)}
                  className={`w-8 h-8 transition-all duration-300`}
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                  }}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,232,31,0.8)]"
                        : isCompleted
                        ? "bg-cyan-500 text-white shadow-[0_0_10px_rgba(0,243,255,0.6)]"
                        : "bg-gray-800 text-gray-500 border border-gray-600"
                    }`}
                  >
                    {idx + 1}
                  </div>
                </button>

                {idx < milestones.length - 1 && (
                  <div
                    className={`w-3 h-[2px] ${
                      isCompleted ? "bg-cyan-500" : "bg-gray-700"
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MissionLog;
