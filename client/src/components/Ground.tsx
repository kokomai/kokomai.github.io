import React from "react";

const Ground: React.FC = () => {
  // Create a pattern for the ground instead of using an image
  return (
    <div 
      className="absolute bottom-0 w-full h-24 z-30 animate-ground bg-[#5A3825]"
      style={{ 
        backgroundImage: 'repeating-linear-gradient(to right, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 16px, transparent 16px, transparent 32px)',
        backgroundSize: '64px 100%'
      }}
    ></div>
  );
};

export default Ground;
