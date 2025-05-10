import React from "react";

const DestinationBuilding: React.FC = () => {
  return (
    <div className="absolute right-0 bottom-24 z-20 animate-building">
      {/* This would be an image, but we're avoiding binary files */}
      <div className="pixel-art h-48 w-48 flex flex-col">
        <div className="h-1/4 bg-blue-900 flex items-center justify-center">
          <div className="w-1/3 h-1/2 bg-white"></div>
        </div>
        <div className="h-3/4 bg-amber-700 flex flex-wrap">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1/6 h-1/6 border border-amber-800 flex items-center justify-center">
              <div className="w-2/3 h-2/3 bg-yellow-400"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationBuilding;
