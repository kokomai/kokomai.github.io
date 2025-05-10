import React from 'react';
import { motion } from 'framer-motion';
import { Page } from '@/lib/types';

// Import building images
import building01 from "@assets/building_01.png";
import building02 from "@assets/building_02.png";
import building03 from "@assets/building_03.png";
import building04 from "@assets/building_04.png";
import building05 from "@assets/building_05.png";
import snuImage from "@assets/snu-1.png.png";
import finalBuilding from "@assets/final1.png";
import togetherImage from "@assets/together.png.png";
import finalWeddingImage from "@assets/final_wedding.png";
import brideGif from "@assets/bride.gif";
import buildingsImage from "@assets/buildings.png";
import groundImage from "@assets/ground.png";
import groomGif from "@assets/groom.gif";

// Map page to building image
const buildingImages = {
  [Page.PAGE1]: building01,
  [Page.PAGE2]: null, // Page 2 will use building_02 and building_05 directly
  [Page.PAGE3]: building04,
  [Page.PAGE4]: building03,
  [Page.PAGE5]: finalBuilding, // Updated to finalBuilding
  [Page.PAGE6]: finalWeddingImage,  // Using new final wedding image
};

interface DotAreaProps {
  currentPage: Page;
  isTransitioning: boolean;
  characterPosition: number;
  currentBuilding: number;
  onGoHome: () => void;
}

const DotArea: React.FC<DotAreaProps> = ({
  currentPage,
  isTransitioning,
  characterPosition,
  currentBuilding,
  onGoHome,
}) => {
  return (
    <div className="h-36 w-full relative overflow-hidden mt-auto z-50">
      {/* Page number indicator - at the very bottom */}
      <div className="absolute bottom-1 w-full z-40 flex justify-center">
        <p className="text-white font-korean text-sm bg-black/30 px-3 py-1 rounded-full">
          {currentBuilding}/6
        </p>
      </div>


      {/* Buildings background */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ 
          backgroundImage: `url(${buildingsImage})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'contain',
          backgroundPosition: 'bottom',
          height: '70%',
          bottom: '5px',
          top: '5px'
        }}
      ></div>

      {/* Ground */}
      <div 
        className="absolute bottom-0 w-full z-20"
        style={{ 
          backgroundImage: `url(${groundImage})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          height: '3.5rem'
        }}
      ></div>

      {/* Buildings display area */}
      {currentPage === Page.PAGE2 && (
        <div className="absolute bottom-7 right-0 z-30 flex justify-end px-4">
          {/* Second page shows buildings 2 and 5 */}
          <div className="h-24 w-24 pixel-art overflow-hidden mr-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <img 
                src={building02} 
                alt="Building 2" 
                className="h-full w-full"
              />
            </motion.div>
          </div>
          <div className="h-24 w-24 pixel-art overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <img 
                src={building05} 
                alt="Building 5" 
                className="h-full w-full"
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Page 3 shows building 4 only */}
      {currentPage === Page.PAGE3 && (
        <div className="absolute bottom-7 right-6 z-30 h-28 w-28 pixel-art overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <img 
              src={building04} 
              alt="Building 4" 
              className="h-full w-full"
            />
          </motion.div>
        </div>
      )}

      {/* Page 5 shows final building and bride */}
      {currentPage === Page.PAGE5 && (
        <div className="flex absolute bottom-7 right-0 z-30 justify-end w-full">
          {/* Final Building - moved to far right, larger size */}
          <div className="h-40 w-44 pixel-art overflow-hidden mr-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <img 
                src={finalBuilding} 
                alt="Final Building" 
                className="h-full w-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Bride positioned separately, below the building */}
      {currentPage === Page.PAGE5 && (
        <div className="absolute bottom-7 right-8 z-30 h-14 w-14 pixel-art overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <img 
              src={brideGif} 
              alt="Bride" 
              className="h-full w-full object-contain"
            />
          </motion.div>
        </div>
      )}

      {/* Fixed position for single building display (pages 1, 4) */}
      {(currentPage === Page.PAGE1 || currentPage === Page.PAGE4) && (
        <div className="absolute bottom-7 right-6 z-30 h-28 w-28 pixel-art overflow-hidden">
          <motion.div
            key={currentPage} // Key ensures React treats each page change as a new element
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <img 
              src={buildingImages[currentPage]} 
              alt={`Building ${currentBuilding}`} 
              className="h-full w-full"
            />
          </motion.div>
        </div>
      )}
      
      {/* Special case for page 6 with larger together image and only */}
      {currentPage === Page.PAGE6 && (
        <div className="flex flex-col items-center justify-center w-full h-full z-30 absolute bottom-2">
          {/* 이미지만 표시하고 텍스트는 페이지에서 별도로 표시 */}
          <div className="h-60 w-60 mx-auto pixel-art overflow-hidden">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <img 
                src={finalWeddingImage} 
                alt="Together" 
                className="h-full w-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* Running character - using GIF (hidden on page 6) */}
      {currentPage !== Page.PAGE6 && (
        <motion.div 
          className="absolute bottom-7 z-30 h-14 w-14"
          animate={{ 
            left: `${characterPosition + 5}%` // Base 5% plus additional distance per page
          }}
          transition={{ 
            type: "spring",
            stiffness: 70,
            damping: 20
          }}
        >
          <img 
            src={groomGif} 
            alt="Running Groom" 
            className="h-full w-full object-contain pixel-art"
          />
        </motion.div>
      )}
    </div>
  );
};

export default DotArea;