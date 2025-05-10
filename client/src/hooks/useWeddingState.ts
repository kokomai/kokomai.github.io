import { useCallback, useEffect, useRef, useState } from 'react';
import { Page, WeddingState } from '@/lib/types';

// 페이지 번호를 문자열 페이지명으로 변환
const getPageFromIndex = (index: number): Page => {
  return `page${index}` as Page;
};

// 페이지명에서 페이지 번호 추출
const getIndexFromPage = (page: Page): number => {
  return parseInt(page.replace('page', ''));
};

// 캐릭터 위치 계산
const calculateCharacterPosition = (pageIndex: number): number => {
  // 5페이지는 특별한 위치 (55%)
  if (pageIndex === 5) return 55;
  // 다른 페이지는 ~16%씩 진행
  return (pageIndex - 1) * 16;
};

export const useWeddingState = () => {
  // 상태 초기화 (페이지 1부터 시작)
  const [state, setState] = useState<WeddingState>({
    currentPage: Page.PAGE1,
    isTransitioning: false,
    characterPosition: 0,
    currentBuilding: 1
  });

  // 스크롤 이벤트 제어를 위한 참조 변수들
  const scrollLock = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  // 애니메이션 완료 후 호출될 함수 (전환 상태 초기화)
  const resetTransition = useCallback(() => {
    setState(prev => ({ ...prev, isTransitioning: false }));
    scrollLock.current = false;
  }, []);

  // 특정 페이지로 이동하는 함수
  const goToPage = useCallback((page: Page) => {
    if (scrollLock.current) return;
    scrollLock.current = true;
    
    const pageIndex = getIndexFromPage(page);
    
    setState(prev => ({
      ...prev,
      currentPage: page,
      isTransitioning: true,
      characterPosition: calculateCharacterPosition(pageIndex),
      currentBuilding: pageIndex
    }));

    // 이전 타임아웃 취소
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // 새 타임아웃 설정
    timeoutRef.current = window.setTimeout(resetTransition, 600);
  }, [resetTransition]);

  // 홈 페이지(1페이지)로 이동
  const goToHomePage = useCallback(() => {
    goToPage(Page.PAGE1);
  }, [goToPage]);

  // 다음 페이지로 이동
  const nextPage = useCallback(() => {
    setState(prev => {
      if (scrollLock.current) return prev;
      scrollLock.current = true;
      
      const currentIndex = getIndexFromPage(prev.currentPage);
      
      // 이미 마지막 페이지면 상태 변경 없음
      if (currentIndex >= 6) {
        scrollLock.current = false;
        return prev;
      }
      
      const nextIndex = currentIndex + 1;
      const nextPageName = getPageFromIndex(nextIndex);
      
      // 타임아웃 설정
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(resetTransition, 600);
      
      return {
        ...prev,
        currentPage: nextPageName,
        isTransitioning: true,
        characterPosition: calculateCharacterPosition(nextIndex),
        currentBuilding: nextIndex
      };
    });
  }, [resetTransition]);

  // 이전 페이지로 이동
  const prevPage = useCallback(() => {
    setState(prev => {
      if (scrollLock.current) return prev;
      scrollLock.current = true;
      
      const currentIndex = getIndexFromPage(prev.currentPage);
      
      // 이미 첫 페이지면 상태 변경 없음
      if (currentIndex <= 1) {
        scrollLock.current = false;
        return prev;
      }
      
      const prevIndex = currentIndex - 1;
      const prevPageName = getPageFromIndex(prevIndex);
      
      // 타임아웃 설정
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(resetTransition, 600);
      
      return {
        ...prev,
        currentPage: prevPageName,
        isTransitioning: true,
        characterPosition: calculateCharacterPosition(prevIndex),
        currentBuilding: prevIndex
      };
    });
  }, [resetTransition]);

  // 스크롤 및 키보드 이벤트 설정
  useEffect(() => {
    // 스크롤 이벤트 핸들러
    const handleScroll = (e: WheelEvent) => {
      // 잠금 상태 또는 전환중이면 무시
      if (scrollLock.current) return;
      
      // 기본 스크롤 동작 방지
      e.preventDefault();
      
      if (e.deltaY > 0) {
        // 아래로 스크롤 - 다음 페이지
        nextPage();
      } else if (e.deltaY < 0) {
        // 위로 스크롤 - 이전 페이지
        prevPage();
      }
    };

    // 키보드 이벤트 핸들러
    const handleKeyDown = (e: KeyboardEvent) => {
      // 잠금 상태 또는 전환중이면 무시
      if (scrollLock.current) return;
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      }
    };

    // 터치 이벤트 관련 변수
    let touchStartY = 0;
    
    // 터치 시작 이벤트 핸들러
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    // 터치 종료 이벤트 핸들러
    const handleTouchEnd = (e: TouchEvent) => {
      // 잠금 상태 또는 전환중이면 무시
      if (scrollLock.current) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchEndY - touchStartY;
      
      // 일정 거리 이상 스와이프해야 페이지 전환
      if (Math.abs(diffY) > 50) {
        if (diffY < 0) {
          // 위로 스와이프 - 다음 페이지
          nextPage();
        } else {
          // 아래로 스와이프 - 이전 페이지
          prevPage();
        }
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 타이머 정리
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [nextPage, prevPage]);

  return {
    ...state,
    goToPage,
    goToHomePage,
    nextPage,
    prevPage
  };
};