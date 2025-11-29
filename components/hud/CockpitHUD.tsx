import React from "react";
import Radar from "./Radar";
import StatusDisplay from "./StatusDisplay";
import MissionLog from "./MissionLog";
import MilestoneCard from "./MilestoneCard";
import MobileControls from "./MobileControls";
import { GameState, InputState, Milestone } from "../../types";
import { GAME_CONFIG } from "../../constants";

interface CockpitHUDProps {
  gameState: GameState;
  inputRef: React.MutableRefObject<InputState>;
  milestones: Milestone[];
  hoveredMilestoneIndex: number | null;
  setHoveredMilestoneIndex: (index: number | null) => void;
  milestoneExpanded: boolean;
}

const CockpitHUD: React.FC<CockpitHUDProps> = ({
  gameState,
  inputRef,
  milestones,
  hoveredMilestoneIndex,
  setHoveredMilestoneIndex,
  milestoneExpanded,
}) => {
  const displayMilestoneIndex =
    hoveredMilestoneIndex !== null
      ? hoveredMilestoneIndex
      : gameState.currentMilestoneIndex;
  const displayMilestone = milestones[displayMilestoneIndex];
  const isCardVisible =
    displayMilestone &&
    (hoveredMilestoneIndex !== null ||
      milestoneExpanded ||
      displayMilestoneIndex === gameState.currentMilestoneIndex);
  const isCardExpanded = hoveredMilestoneIndex !== null || milestoneExpanded;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none p-4 md:p-8 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <Radar />

        <StatusDisplay
          score={gameState.score}
          shield={gameState.shield}
          distance={gameState.distance}
          maxDistance={GAME_CONFIG.TOTAL_DISTANCE}
          isPaused={gameState.isPaused}
        />
      </div>

      {/* Left Side - Mission Log */}
      <div className="absolute left-4 md:left-8 top-1/3 transform -translate-y-1/3 pointer-events-auto">
        <MissionLog
          milestones={milestones}
          currentMilestoneIndex={gameState.currentMilestoneIndex}
          hoveredMilestoneIndex={hoveredMilestoneIndex}
          onHover={setHoveredMilestoneIndex}
        />
      </div>

      {/* Right Side - Milestone Card */}
      {isCardVisible && displayMilestone && (
        <div className="absolute top-32 right-4 md:right-12">
          <MilestoneCard
            milestone={displayMilestone}
            isExpanded={isCardExpanded}
            isHovered={hoveredMilestoneIndex !== null}
          />
        </div>
      )}

      {/* Bottom - Mobile Controls */}
      <MobileControls inputRef={inputRef} />
    </div>
  );
};

export default CockpitHUD;
