import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Player from "./Player";
import Ground from "./Ground";
import DestinationBuilding from "./DestinationBuilding";
import skyImage from "@assets/sky.png";

interface GameScreenProps {
  progress: number;
  hasJumped: boolean;
  onJump: () => void;
  incrementProgress: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ 
  progress, 
  hasJumped, 
  onJump,
  incrementProgress 
}) => {
  useEffect(() => {
    // Start progress counter
    const interval = setInterval(() => {
      incrementProgress();
    }, 300);
    
    return () => clearInterval(interval);
  }, [incrementProgress]);

  return (
    <motion.div 
      className="h-full w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sky background with parallax effect */}
      <div 
        className="absolute inset-0 z-10 animate-sky" 
        style={{ 
          backgroundImage: `url(${skyImage})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'contain'
        }}
      ></div>
      
      {/* Destination building (wedding hall) */}
      <DestinationBuilding />
      
      {/* Ground */}
      <Ground />
      
      {/* Player character */}
      <Player hasJumped={hasJumped} />
      
      {/* Traditional Korean buildings in the background */}
      <div className="absolute bottom-24 z-15 animate-building">
        <div className="pixel-art h-32 mx-4 bg-blue-900 w-40">
          {/* This would be an image, but we're avoiding binary files */}
          <div className="h-full w-full bg-blue-800 flex items-center justify-center">
            <div className="w-3/4 h-3/4 bg-yellow-400 flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-blue-900"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game UI elements */}
      <div className="absolute top-0 left-0 w-full p-4 z-50 flex justify-between items-center">
        <div className="font-pixel text-xs text-white bg-black bg-opacity-50 p-2 rounded">
          <span id="progress-text">{progress}%</span>
        </div>
        <button 
          className="font-pixel text-xs text-white bg-[#FFD700] bg-opacity-70 rounded-full w-12 h-12 flex items-center justify-center"
          onClick={onJump}
        >
          점프
        </button>
      </div>
    </motion.div>
  );
};

export default GameScreen;
