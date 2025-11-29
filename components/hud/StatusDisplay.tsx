import React from "react";

interface StatusDisplayProps {
  score: number;
  shield: number;
  distance: number;
  maxDistance: number;
  isPaused: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  score,
  shield,
  distance,
  maxDistance,
  isPaused,
}) => {
  const progress = Math.min(100, (distance / maxDistance) * 100);
  const isShieldCritical = shield < 30;

  return (
    <div className="flex flex-col items-center md:items-end gap-3">
      {/* Score Display with Background Panel */}
      <div className="relative">
        {/* Corner Brackets */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-400/60"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-yellow-400/60"></div>

        <div className="text-center md:text-right bg-black/50 backdrop-blur-sm px-4 py-2 border border-yellow-500/30 relative overflow-hidden">
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,232,31,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,232,31,0.1) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          ></div>

          <div className="relative z-10">
            <div className="text-yellow-400 text-2xl md:text-4xl lg:text-5xl font-bold star-wars-font tracking-widest drop-shadow-[0_0_15px_rgba(255,232,31,0.6)]">
              {score.toString().padStart(6, "0")}
            </div>
            <div className="text-cyan-500 text-[10px] md:text-xs tracking-[0.2em] hud-font uppercase mt-1">
              Credits Earned
            </div>
            {isPaused && (
              <div className="text-red-500 text-xs md:text-lg animate-pulse mt-2 font-bold tracking-widest hud-font border-t border-red-500/30 pt-1">
                » SYSTEM PAUSED «
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 md:gap-6">
        {/* Shield Gauge with Hexagonal Frame */}
        <div className="relative">
          {/* Hexagonal Background Panel */}
          <div
            className={`absolute -inset-2 bg-black/40 backdrop-blur-sm border-2 transition-all duration-300 ${
              isShieldCritical
                ? "border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                : "border-cyan-500/40 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
            }`}
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          ></div>

          <div className="flex flex-col items-center relative z-10">
            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
              {/* Animated Tick Marks */}
              <svg
                className="absolute inset-0 w-full h-full"
                style={{ transform: "rotate(-90deg)" }}
              >
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 50 + 38 * Math.cos(angle);
                  const y1 = 50 + 38 * Math.sin(angle);
                  const x2 = 50 + 42 * Math.cos(angle);
                  const y2 = 50 + 42 * Math.sin(angle);
                  const isActive = (i / 12) * 100 <= shield;
                  return (
                    <line
                      key={i}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      className={`transition-all duration-300 ${
                        isActive
                          ? isShieldCritical
                            ? "stroke-red-400"
                            : "stroke-cyan-400"
                          : "stroke-gray-700"
                      }`}
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* Gauge Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="35%"
                  className="stroke-gray-800 fill-none stroke-[5]"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="35%"
                  className={`fill-none stroke-[5] transition-all duration-300 ${
                    isShieldCritical
                      ? "stroke-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                      : "stroke-cyan-400 drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]"
                  }`}
                  strokeDasharray="220"
                  strokeDashoffset={220 - (220 * shield) / 100}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Value */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={`font-bold text-sm md:text-base lg:text-lg terminal-font ${
                    isShieldCritical
                      ? "text-red-100 animate-pulse"
                      : "text-cyan-100"
                  }`}
                >
                  {Math.round(shield)}%
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="mt-2 flex flex-col items-center">
              <span
                className={`text-[10px] md:text-xs uppercase tracking-widest font-bold hud-font ${
                  isShieldCritical ? "text-red-400" : "text-cyan-400"
                }`}
              >
                Shields
              </span>
              {isShieldCritical && (
                <span className="text-[8px] text-red-500 animate-pulse terminal-font tracking-wider">
                  ! CRITICAL !
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Distance Gauge with Hexagonal Frame */}
        <div className="relative">
          {/* Hexagonal Background Panel */}
          <div
            className="absolute -inset-2 bg-black/40 backdrop-blur-sm border-2 border-yellow-500/40 shadow-[0_0_15px_rgba(255,232,31,0.2)]"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          ></div>

          <div className="flex flex-col items-center relative z-10">
            <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
              {/* Animated Tick Marks */}
              <svg
                className="absolute inset-0 w-full h-full"
                style={{ transform: "rotate(-90deg)" }}
              >
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 50 + 38 * Math.cos(angle);
                  const y1 = 50 + 38 * Math.sin(angle);
                  const x2 = 50 + 42 * Math.cos(angle);
                  const y2 = 50 + 42 * Math.sin(angle);
                  const isActive = (i / 12) * 100 <= progress;
                  return (
                    <line
                      key={i}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      className={`transition-all duration-300 ${
                        isActive ? "stroke-yellow-400" : "stroke-gray-700"
                      }`}
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              {/* Gauge Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="35%"
                  className="stroke-gray-800 fill-none stroke-[5]"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="35%"
                  className="fill-none stroke-yellow-400 stroke-[5] transition-all duration-500 drop-shadow-[0_0_8px_rgba(255,232,31,0.6)]"
                  strokeDasharray="220"
                  strokeDashoffset={220 - (220 * progress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Value */}
              <div className="absolute inset-0 flex items-center justify-center font-bold text-yellow-100 text-sm md:text-base lg:text-lg terminal-font">
                {Math.round(progress)}%
              </div>
            </div>

            {/* Label */}
            <span className="text-[10px] md:text-xs text-yellow-400 uppercase tracking-widest mt-2 font-bold hud-font">
              Distance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;
