import React from "react";

interface GameContainerProps {
  children: React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ children }) => {
  return (
    <div className="w-full h-screen max-w-[500px] mx-auto overflow-hidden relative bg-white z-10 md:shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      {children}
    </div>
  );
};

export default GameContainer;
