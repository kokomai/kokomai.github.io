import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeddingState } from '@/hooks/useWeddingState';
import { Page } from '@/lib/types';
import DotArea from '@/components/DotArea';
import PageContent from '@/components/PageContent';

// 아이콘
import { ChevronDown } from 'lucide-react';

// 이미지 import
import finalWeddingPng from '@assets/final_wedding.png';

const WeddingApp: React.FC = () => {
  const { 
    currentPage, 
    isTransitioning, 
    characterPosition, 
    currentBuilding,
    goToHomePage,
    nextPage
  } = useWeddingState();
  
  // 스와이프 화살표 안내 표시 상태
  const [showArrow, setShowArrow] = useState(false);
  const [interactionTimer, setInteractionTimer] = useState<NodeJS.Timeout | null>(null);
  
  // 페이지가 변경될 때마다 화살표 상태 관리
  useEffect(() => {
    // 마지막 페이지를 제외한 모든 페이지에서 타이머 설정
    if (currentPage !== Page.PAGE6) {
      // 이전 타이머 정리
      if (interactionTimer) {
        clearTimeout(interactionTimer);
      }
      
      // 3초 후에 화살표 표시
      const timer = setTimeout(() => {
        setShowArrow(true);
      }, 3000);
      
      setInteractionTimer(timer);
    } else {
      // 마지막 페이지에서는 화살표 숨김
      setShowArrow(false);
    }
    
    return () => {
      if (interactionTimer) {
        clearTimeout(interactionTimer);
      }
    };
  }, [currentPage]);
  
  // 사용자 상호작용 감지
  useEffect(() => {
    const handleInteraction = () => {
      // 상호작용 시 화살표 숨김
      setShowArrow(false);
      
      // 이전 타이머 취소
      if (interactionTimer) {
        clearTimeout(interactionTimer);
        setInteractionTimer(null);
      }
    };
    
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('wheel', handleInteraction);
    
    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
    };
  }, [interactionTimer]);

  // 6페이지일 경우 특별한 레이아웃 적용
  const isLastPage = currentPage === Page.PAGE6;

  return (
    <div className="flex flex-col h-[100svh] max-w-[100%] xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto relative bg-white overflow-hidden">
      {/* 스와이프 안내 화살표 - 6페이지를 제외한 모든 페이지에서 3초 후 나타남 */}
      {showArrow && !isLastPage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, y: [0, 3, 0] }}
          transition={{ 
            opacity: { duration: 0.9 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          onClick={() => nextPage()}
          className="fixed bottom-36 left-[47%] z-50 bg-black/15 rounded-full p-1.5 cursor-pointer backdrop-blur-sm"
        >
          <ChevronDown size={20} className="text-black/70" />
        </motion.div>
      )}
      {/* Page content - 컨텐츠 영역 크기 확대 및 6페이지에서는 표시하지 않음 */}
      {!isLastPage && (
        <AnimatePresence mode="wait">
          <div className="flex-1 overflow-hidden pt-0 mt-0">
            <PageContent 
              currentPage={currentPage} 
              isTransitioning={isTransitioning}
              onGoHome={goToHomePage}
            />
          </div>
        </AnimatePresence>
      )}

      {/* 6번 페이지 완전히 새로운 레이아웃 */}
      {isLastPage ? (
        <div className="relative flex flex-col items-center h-full w-full overflow-auto bg-white">
          
          {/* 컨텐츠 영역 - 테두리 안쪽에 표시, 중앙 정렬 */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-8 mt-2">
            {/* 중앙 이미지 - final_wedding.png 화면 너비 90%로 표시 */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-[90%] mb-6"
            >
              <img 
                src={finalWeddingPng}
                alt="Together" 
                className="w-full object-contain pixel-art"
              />
            </motion.div>
            
            {/* 감사합니다 텍스트 - 이미지 아래 중앙에 배치 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 1.0 }}
              className="text-center responsive-text-2xl font-bold text-[#333] font-serif w-full mb-8"
            >
              감사합니다
            </motion.div>
          </div>
          
          {/* 처음으로 버튼 - 감사합니다 텍스트 아래 중앙에 배치 */}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.0 }}
            onClick={goToHomePage}
            className="bg-white/80 hover:bg-white text-black px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 rounded-full responsive-text-lg font-medium font-korean transition-colors duration-300 shadow-lg border border-gray-200 mb-16 relative z-10"
            style={{ 
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)'
            }}
          >
            처음으로
          </motion.button>
          
          {/* 페이지 번호 - 도트영역의 페이지 번호와 정확히 동일한 스타일 */}
          <div className="absolute bottom-1 w-full z-40 flex justify-center">
            <p className="text-white font-korean text-sm bg-black/30 px-3 py-1 rounded-full">
              6/6
            </p>
          </div>
          
          {/* 하단 여백 확보 */}
          <div className="h-6 w-full"></div>
        </div>
      ) : (
        <>
          {/* 일반 페이지용 Home 버튼 제거 */}

          {/* 도트 영역 - 하단에 고정 및 항상 위에 표시 */}
          <div className="relative z-50">
            <DotArea 
              currentPage={currentPage}
              isTransitioning={isTransitioning}
              characterPosition={characterPosition}
              currentBuilding={currentBuilding}
              onGoHome={goToHomePage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WeddingApp;