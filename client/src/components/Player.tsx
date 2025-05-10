import { useEffect, useState } from "react";
import playerRunSprite from "@assets/player_run.png";
import playerJumpSprite from "@assets/player_jump.png";

interface PlayerProps {
  hasJumped: boolean;
}

const Player: React.FC<PlayerProps> = ({ hasJumped }) => {
  const backgroundImage = hasJumped ? playerJumpSprite : playerRunSprite;
  const animationClass = hasJumped ? "" : "animate-run";
  const jumpClass = hasJumped ? "animate-jump" : "";

  return (
    <div className={`absolute bottom-20 left-24 z-40 h-12 w-10 ${jumpClass}`}>
      <div 
        className={`h-full w-full ${animationClass} pixel-art`}
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover'
        }}
      ></div>
    </div>
  );
};

export default Player;
