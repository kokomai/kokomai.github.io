import { motion } from "framer-motion";

interface InfoScreenProps {
  onContinue: () => void;
}

const InfoScreen: React.FC<InfoScreenProps> = ({ onContinue }) => {
  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="font-pixel text-xl text-center mb-6 text-[#FFD700] title-glow">
          Wedding Information
        </h2>
        
        <div className="font-korean mb-6">
          <h3 className="font-bold text-lg mb-2">김철수 & 이영희</h3>
          <p className="text-sm mb-4">
            2023년 12월 25일 토요일 오후 1시
          </p>
          <p className="text-sm">
            서울특별시 강남구 테헤란로 123<br />
            그랜드 웨딩홀 5층
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 rounded p-2 text-center">
            <p className="font-korean text-sm font-bold">신랑측 혼주</p>
            <p className="font-korean text-xs">김OO & 박OO</p>
          </div>
          <div className="border border-gray-200 rounded p-2 text-center">
            <p className="font-korean text-sm font-bold">신부측 혼주</p>
            <p className="font-korean text-xs">이OO & 최OO</p>
          </div>
        </div>
        
        <motion.button 
          className="w-full font-pixel bg-[#FFD700] text-black py-2 px-4 rounded-lg hover:bg-yellow-400 transition-all"
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InfoScreen;
