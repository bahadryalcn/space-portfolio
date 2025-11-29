import React from "react";
import { Milestone } from "../../types";

interface MilestoneCardProps {
  milestone: Milestone;
  isExpanded: boolean;
  isHovered: boolean;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  isExpanded,
  isHovered,
}) => {
  // Type-specific color coding
  const getTypeColor = () => {
    switch (milestone.type) {
      case "education":
        return "yellow";
      case "work":
        return "cyan";
      case "project":
        return "red";
      default:
        return "cyan";
    }
  };

  const typeColor = getTypeColor();
  const borderColorClass = isHovered
    ? `border-${typeColor}-400`
    : `border-${typeColor}-500/60`;

  return (
    <div
      className={`relative bg-black/90 backdrop-blur-md p-4 md:p-6 transform transition-all duration-500 ease-out cursor-pointer group pointer-events-auto overflow-hidden
         ${isExpanded ? "w-full md:w-80 lg:w-[28rem]" : "w-64 md:w-72"}`}
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      {/* Animated Border Segments */}
      <div className="absolute inset-0 opacity-60">
        {/* Top border segment */}
        <div
          className={`absolute top-0 left-0 h-[2px] bg-gradient-to-r transition-all duration-500 ${
            isHovered
              ? `from-${typeColor}-400 to-${typeColor}-600 w-full`
              : `from-${typeColor}-500 to-transparent w-1/3`
          }`}
          style={{
            animation: isExpanded
              ? "borderGlow 2s ease-in-out infinite"
              : "none",
          }}
        ></div>

        {/* Right border segment */}
        <div
          className={`absolute right-0 top-0 w-[2px] bg-gradient-to-b transition-all duration-500 ${
            isHovered
              ? `from-${typeColor}-400 to-${typeColor}-600 h-full`
              : `from-${typeColor}-500 to-transparent h-1/3`
          }`}
        ></div>

        {/* Bottom border segment */}
        <div
          className={`absolute bottom-0 right-0 h-[2px] bg-gradient-to-l transition-all duration-500 ${
            isHovered
              ? `from-${typeColor}-400 to-${typeColor}-600 w-full`
              : `from-${typeColor}-500 to-transparent w-1/3`
          }`}
        ></div>

        {/* Left border segment */}
        <div
          className={`absolute left-0 bottom-0 w-[2px] bg-gradient-to-t transition-all duration-700 ${
            isHovered
              ? `from-${typeColor}-400 to-${typeColor}-600 h-full`
              : `from-${typeColor}-500 to-transparent h-1/3`
          }`}
        ></div>
      </div>

      {/* Holographic Shimmer Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-400/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div
          className="h-full w-full animate-[scanline_8s_linear_infinite]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,243,255,0.03) 2px, rgba(0,243,255,0.03) 4px)",
          }}
        ></div>
      </div>

      {/* Corner Cut Indicators */}
      <div
        className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 opacity-40"
        style={{
          borderColor: isHovered
            ? `var(--${typeColor}-400)`
            : `var(--${typeColor}-500)`,
          transform: "translate(0, 0)",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 opacity-40"
        style={{
          borderColor: isHovered
            ? `var(--${typeColor}-400)`
            : `var(--${typeColor}-500)`,
          transform: "translate(0, 0)",
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`px-2 py-0.5 text-[8px] md:text-[10px] font-bold terminal-font uppercase tracking-wider border ${
                  typeColor === "yellow"
                    ? "bg-yellow-900/30 border-yellow-500/50 text-yellow-300"
                    : typeColor === "red"
                    ? "bg-red-900/30 border-red-500/50 text-red-300"
                    : "bg-cyan-900/30 border-cyan-500/50 text-cyan-300"
                }`}
              >
                {milestone.type === "education"
                  ? "🎓 Education"
                  : milestone.type === "work"
                  ? "💼 Work"
                  : "🚀 Project"}
              </div>
              <div
                className={`text-[10px] md:text-xs font-bold hud-font tracking-wider ${
                  isHovered
                    ? typeColor === "yellow"
                      ? "text-yellow-300"
                      : typeColor === "red"
                      ? "text-red-300"
                      : "text-cyan-300"
                    : "text-gray-400"
                }`}
              >
                {milestone.year}
              </div>
            </div>

            {/* Title */}
            <h2
              className={`font-bold text-base md:text-lg lg:text-xl star-wars-font leading-tight transition-colors duration-300 ${
                isHovered
                  ? typeColor === "yellow"
                    ? "text-yellow-400"
                    : typeColor === "red"
                    ? "text-red-400"
                    : "text-cyan-400"
                  : "text-white"
              }`}
            >
              {milestone.title}
            </h2>
          </div>

          {/* Expand/Collapse Indicator */}
          <div
            className={`ml-3 text-xl font-bold transition-all duration-300 ${
              isHovered
                ? typeColor === "yellow"
                  ? "text-yellow-400 opacity-100"
                  : typeColor === "red"
                  ? "text-red-400 opacity-100"
                  : "text-cyan-400 opacity-100"
                : "text-gray-600 opacity-50"
            }`}
          >
            {isExpanded ? (
              <span className="inline-block rotate-0 transition-transform duration-300">
                ▼
              </span>
            ) : (
              <span className="inline-block -rotate-90 transition-transform duration-300">
                ▼
              </span>
            )}
          </div>
        </div>

        {/* Expandable Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded
              ? "max-h-[500px] opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          {/* Divider Line */}
          <div
            className={`h-[1px] w-full mb-4 bg-gradient-to-r ${
              typeColor === "yellow"
                ? "from-yellow-400/60 via-yellow-500/40 to-transparent"
                : typeColor === "red"
                ? "from-red-400/60 via-red-500/40 to-transparent"
                : "from-cyan-400/60 via-cyan-500/40 to-transparent"
            }`}
          ></div>

          {/* Description List */}
          <ul className="text-sm md:text-base text-gray-300 terminal-font space-y-3">
            {milestone.description.map((desc, i) => (
              <li key={i} className="flex items-start group/item">
                <span
                  className={`mr-3 mt-1 transition-colors ${
                    typeColor === "yellow"
                      ? "text-yellow-500 group-hover/item:text-yellow-400"
                      : typeColor === "red"
                      ? "text-red-500 group-hover/item:text-red-400"
                      : "text-cyan-500 group-hover/item:text-cyan-400"
                  }`}
                >
                  ▸
                </span>
                <span className="leading-relaxed flex-1 group-hover/item:text-white transition-colors">
                  {desc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Glow Effect */}
      <div
        className={`absolute inset-0 -z-10 blur-xl opacity-20 transition-opacity duration-500 ${
          isHovered ? "opacity-40" : "opacity-10"
        }`}
        style={{
          background:
            typeColor === "yellow"
              ? "radial-gradient(circle at 50% 50%, rgba(255,232,31,0.3), transparent 70%)"
              : typeColor === "red"
              ? "radial-gradient(circle at 50% 50%, rgba(239,68,68,0.3), transparent 70%)"
              : "radial-gradient(circle at 50% 50%, rgba(0,243,255,0.3), transparent 70%)",
        }}
      ></div>
    </div>
  );
};

export default MilestoneCard;
