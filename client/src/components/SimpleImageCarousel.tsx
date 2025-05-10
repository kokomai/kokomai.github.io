import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 슬라이드 이미지 임포트
import wedding1 from '@assets/wedding_samples/wedding1.jpg';
import wedding2 from '@assets/wedding_samples/wedding2.jpg';
import wedding3 from '@assets/wedding_samples/wedding3.jpg';
import wedding4 from '@assets/wedding_samples/wedding4.jpg';
import wedding5 from '@assets/wedding_samples/wedding5.jpg';
import wedding6 from '@assets/wedding_samples/wedding6.jpg';
import wedding8 from '@assets/wedding_samples/wedding8.jpg';
import wedding9 from '@assets/wedding_samples/wedding9.jpg';
import wedding10 from '@assets/wedding_samples/wedding10.jpg';
import wedding11 from '@assets/wedding_samples/wedding11.jpg';

// 첫번째 슬라이더 이미지 배열 (5장)
const SLIDE_IMAGES_1 = [wedding1, wedding2, wedding3, wedding4, wedding5];

// 두번째 슬라이더 이미지 배열 (5장)
const SLIDE_IMAGES_2 = [wedding6, wedding8, wedding9, wedding10, wedding11];

interface SimpleImageCarouselProps {
  direction?: 'ltr' | 'rtl';
  imageSet?: 'set1' | 'set2';
}

const SimpleImageCarousel: React.FC<SimpleImageCarouselProps> = ({ 
  direction = 'ltr',
  imageSet = 'set1'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = imageSet === 'set1' ? SLIDE_IMAGES_1 : SLIDE_IMAGES_2;
  
  // 이미지 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => 
        direction === 'ltr'
          ? (prevIndex + 1) % images.length
          : (prevIndex - 1 + images.length) % images.length
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images.length, direction]);
  
  return (
    <div className="relative w-full h-[240px] overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: direction === 'ltr' ? 200 : -200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'ltr' ? -200 : 200 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute w-full h-full flex justify-center"
        >
          <img 
            src={images[currentIndex]} 
            alt={`Wedding photo ${currentIndex + 1}`}
            className="h-full object-cover rounded-lg"
            style={{ maxWidth: '90%' }}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* 인디케이터 */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleImageCarousel;