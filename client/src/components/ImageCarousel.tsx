import React, { useRef, useEffect, useState } from 'react';

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

interface ImageCarouselProps {
  direction?: 'ltr' | 'rtl';
  speed?: number;
  imageSet?: 'set1' | 'set2';
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  direction = 'ltr', 
  speed = 1,
  imageSet = 'set1'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const images = imageSet === 'set1' ? SLIDE_IMAGES_1 : SLIDE_IMAGES_2;
  
  // 방향에 따라 이미지 배열 설정 - LTR일 경우 배열 순서 반대로
  const displayImages = direction === 'ltr' ? [...images].reverse() : images;
  
  // 이미지를 계속 반복하여 표시하는 배열 생성
  // 각 이미지가 순환되며 표시되도록 여러 세트를 연결
  const duplicatedImages = [];
  
  // 12번 순환하도록 복제 (충분히 많은 이미지가 준비됨)
  for (let i = 0; i < 8; i++) {
    // 현재의 시작 인덱스 계산 (이미지 배열을 순환하며)
    const startIdx = i % displayImages.length;
    
    // 시작 인덱스부터 이미지 배열 순환적으로 추가
    for (let j = 0; j < displayImages.length; j++) {
      const idx = (startIdx + j) % displayImages.length;
      duplicatedImages.push(displayImages[idx]);
    }
  }
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let animationId: number;
    // 반응형 위치 설정 (화면 크기에 따라 다르게)
    const initialOffset = Math.min(window.innerWidth * 0.2, 80);
    let position = direction === 'ltr' ? -initialOffset : 0;
    
    const animate = () => {
      if (!container) return;
      
      // 부드러운 애니메이션을 위한 작은 움직임값
      const moveAmount = 0.3 * speed;
      
      // 각 이미지의 평균 너비 계산 (간격 포함)
      const avgImageWidth = Math.min(window.innerWidth * 0.6, 220) + 8; // 8px는 간격
      const totalImages = displayImages.length;
      
      // 방향에 따라 이동 (RTL: 오른쪽에서 왼쪽으로)
      if (direction === 'rtl') {
        position -= moveAmount;
        
        // 이미지 세트 하나 분량만큼 이동했을 때 리셋
        // (이렇게 하면 끊김 없이 무한 순환처럼 보임)
        if (Math.abs(position) >= avgImageWidth * totalImages) {
          position += avgImageWidth * totalImages;
        }
      } else {
        position += moveAmount;
        
        // 이미지 세트 하나 분량만큼 이동했을 때 리셋
        if (position >= avgImageWidth * totalImages) {
          position -= avgImageWidth * totalImages;
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
  
  // 화면 크기에 따른 높이 계산 
  const getResponsiveHeight = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth < 360) return 140; // 작은 화면
    if (windowWidth < 480) return 160; // 중간 화면
    if (windowWidth < 768) return 180; // 큰 화면
    return 200; // 매우 큰 화면
  };
  
  // 초기 높이 설정
  const [height, setHeight] = useState(getResponsiveHeight());
  
  // 화면 크기 변경 시 높이 업데이트
  useEffect(() => {
    const handleResize = () => {
      setHeight(getResponsiveHeight());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div 
        className="inline-flex select-none"
        ref={containerRef}
        style={{ 
          whiteSpace: 'nowrap',
          height: `${height}px` 
        }}
      >
        {duplicatedImages.map((src, index) => (
          <div
            key={index}
            className="inline-block px-1"
            style={{ 
              width: Math.min(window.innerWidth * 0.6, 220) + 'px',
            }}
          >
            <div 
              className="rounded-md overflow-hidden shadow-sm"
              style={{ 
                width: '100%',
                paddingBottom: window.innerWidth < 360 ? '65%' : '70%', // 작은 화면에서 더 납작하게
                position: 'relative'
              }}
            >
              <img
                src={src}
                alt={`Wedding image ${index % images.length + 1}`}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                draggable={false}
                loading="eager"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;