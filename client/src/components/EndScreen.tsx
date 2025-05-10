import { motion } from "framer-motion";
import snuImage from "@assets/snu-1.png.png";

interface EndScreenProps {
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ onRestart }) => {
  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <img 
          src={snuImage} 
          alt="Wedding Ceremony" 
          className="pixel-art w-64 mx-auto mb-6"
        />
        <h2 className="font-pixel text-[#FFD700] text-xl mb-4 title-glow">축하합니다!</h2>
        <p className="font-korean text-white mb-8">결혼식장에 도착했습니다</p>
        
        <motion.button 
          className="font-pixel bg-[#FFD700] text-black py-2 px-6 rounded-lg"
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          다시 시작
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EndScreen;
