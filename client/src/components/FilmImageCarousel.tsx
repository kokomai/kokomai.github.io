import React, { useRef, useEffect } from 'react';

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

interface FilmImageCarouselProps {
  direction?: 'ltr' | 'rtl';
  speed?: number;
  imageSet?: 'set1' | 'set2';
}

const FilmImageCarousel: React.FC<FilmImageCarouselProps> = ({ 
  direction = 'ltr', 
  speed = 1,
  imageSet = 'set1'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const images = imageSet === 'set1' ? SLIDE_IMAGES_1 : SLIDE_IMAGES_2;
  
  // 이미지를 여러번 복제해서 무한 스크롤 효과를 만듦
  const duplicatedImages = [...images, ...images, ...images, ...images];
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let animationId: number;
    let position = 0;
    
    const animate = () => {
      if (!container) return;
      
      const moveAmount = 0.8 * speed;
      
      // 방향에 따라 이동 (RTL: 오른쪽에서 왼쪽으로)
      if (direction === 'rtl') {
        position -= moveAmount;
        // position 리셋 조건
        if (Math.abs(position) >= container.scrollWidth / 4) {
          position = 0;
        }
      } else {
        position += moveAmount;
        // position 리셋 조건
        if (position >= container.scrollWidth / 4) {
          position = 0;
        }
      }
      
      container.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [direction, speed]);
  
  return (
    <div className="overflow-hidden">
      {/* 필름 스트립 효과를 주기 위한 상단/하단 라인 */}
      <div className="w-full h-4 bg-black relative mb-1">
        {/* 필름 구멍들 */}
        <div className="absolute top-1 left-0 w-full flex justify-between px-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-[#444] rounded-full"></div>
          ))}
        </div>
      </div>
      
      {/* 이미지 캐러셀 */}
      <div 
        className="inline-flex h-32 sm:h-36 md:h-40 lg:h-44 select-none" 
        ref={containerRef}
        style={{ whiteSpace: 'nowrap' }}
      >
        {duplicatedImages.map((src, index) => (
          <div
            key={index}
            className="inline-block px-1 w-[36%] sm:w-[32%] md:w-[30%] lg:w-[28%]"
          >
            <img
              src={src}
              alt={`Wedding image ${index % images.length + 1}`}
              className="h-full w-full object-cover rounded-sm border-2 border-gray-700"
              draggable={false}
              loading="eager"
            />
          </div>
        ))}
      </div>
      
      {/* 필름 스트립 하단 라인 */}
      <div className="w-full h-4 bg-black relative mt-1">
        {/* 필름 구멍들 */}
        <div className="absolute bottom-1 left-0 w-full flex justify-between px-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-[#444] rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmImageCarousel;