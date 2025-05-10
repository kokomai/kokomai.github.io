import { motion } from "framer-motion";
import titleImage from "@assets/title.png";
import togetherImage from "@assets/together.png.png";

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Wedding title image with pixel art style */}
      <img 
        src={titleImage} 
        alt="Wedding Run Title" 
        className="pixel-art w-4/5 mb-8"
      />
      
      {/* Together image showing couple */}
      <div className="pixel-art w-full flex justify-center mb-12">
        <img 
          src={togetherImage} 
          alt="Bride and Groom Together" 
          className="pixel-art w-48 h-auto"
        />
      </div>
      
      <p className="font-pixel text-white text-xl mb-12">결혼합니다</p>
      
      <motion.button 
        className="font-pixel bg-[#FFD700] text-black py-3 px-8 rounded-lg hover:bg-yellow-400 transition-all"
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        시작하기
      </motion.button>
    </motion.div>
  );
};

export default TitleScreen;
