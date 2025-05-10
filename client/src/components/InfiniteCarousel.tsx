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

interface InfiniteCarouselProps {
  direction?: 'ltr' | 'rtl';
  speed?: number;
  imageSet?: 'set1' | 'set2';
}

/**
 * 더 단순한 접근 방법으로 CSS animation을 사용하는 무한 캐러셀
 */
const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({ 
  direction = 'ltr',
  speed = 1,
  imageSet = 'set1'
}) => {
  // 이미지 선택
  const images = imageSet === 'set1' ? SLIDE_IMAGES_1 : SLIDE_IMAGES_2;
  
  // CSS 애니메이션 속도 계산 (더 작은 값 = 더 빠르게)
  const animationDuration = (100 / speed).toFixed(1);
  
  // 트랙에 이미지 3세트 복제 (충분한 길이를 확보하기 위해)
  const fullImageSet = [...images, ...images, ...images];
  
  return (
    <div className="carousel-container w-full overflow-hidden" style={{ height: '130px' }}>
      <div 
        className={`carousel-track inline-flex ${direction === 'ltr' ? 'animate-carousel-ltr' : 'animate-carousel-rtl'}`}
        style={{
          animationDuration: `${animationDuration}s`,
          // 예상치 못한 일시 정지 방지를 위해 animation-iteration을 무한으로 설정
          animationIterationCount: 'infinite',
          // 일정한 속도로 부드럽게 이동
          animationTimingFunction: 'linear',
          // 애니메이션 멈춤 방지
          willChange: 'transform'
        }}
      >
        {fullImageSet.map((src, index) => (
          <div
            key={index}
            className="carousel-item px-1"
            style={{ width: '180px' }}
          >
            <div 
              className="rounded-md overflow-hidden shadow-sm h-full"
            >
              <img
                src={src}
                alt={`Wedding photo ${index % images.length + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;