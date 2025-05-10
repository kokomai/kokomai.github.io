import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

// 카카오맵 API 스크립트 동적 로드
const loadKakaoMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=ccb275c6e8b5a123a3525a50c557cca9&libraries=services&autoload=false';
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log('카카오맵 API가 로드되었습니다.');
        resolve();
      });
    };
    
    script.onerror = (e) => {
      console.error('카카오맵 API 로드 실패:', e);
      reject(e);
    };
    
    document.head.appendChild(script);
  });
};

const SimpleKakaoMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initMap = async () => {
      try {
        // 스크립트 로드
        await loadKakaoMapScript();
        
        if (!mapContainer.current) return;
        console.log("카카오맵 초기화 시작");
        
        // 루이비스웨딩 중구점 좌표
        const latitude = 37.558624; 
        const longitude = 126.963829;
        
        // 지도 옵션 설정
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3
        };
        
        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer.current, options);
        
        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: map
        });
        
        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:5px;font-size:12px;text-align:center;width:150px;font-weight:bold;">루이비스웨딩 중구점</div>'
        });
        infowindow.open(map, marker);
        
        console.log("카카오맵 초기화 완료");
      } catch (error) {
        console.error("카카오맵 초기화 중 오류 발생:", error);
      }
    };
    
    initMap();
  }, []);
  
  // 네비게이션 앱 열기 함수
  const openNavApp = (app: string) => {
    const lat = 37.558624;
    const lng = 126.963829;
    const name = '루이비스웨딩 중구점';
    const encodedName = encodeURIComponent(name);
    
    switch(app) {
      case 'tmap':
        window.open(`https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xx1a97c5cf7e984d449a830e031f86a16e&name=${encodedName}&lon=${lng}&lat=${lat}`);
        break;
      case 'kakaoNavi':
        window.open(`https://map.kakao.com/link/to/${encodedName},${lat},${lng}`);
        break;
      case 'naverMap':
        window.open(`https://map.naver.com/p/directions/-/${lng},${lat},${encodedName}/-/transit?c=15.00,0,0,0,dh`);
        break;
      case 'kakaoMap':
        window.open(`https://map.kakao.com/link/map/${encodedName},${lat},${lng}`);
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* 지도 영역 */}
      <div 
        ref={mapContainer} 
        className="flex-1 bg-gray-100"
        style={{ minHeight: '180px' }}
      ></div>
      
      {/* 내비게이션 바로가기 버튼 */}
      <div className="bg-white pt-2 pb-3 px-2 border-t border-gray-200 grid grid-cols-4 gap-1 text-center">
        {/* 티맵 */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => openNavApp('tmap')}
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 mb-1 flex items-center justify-center">
            <span className="text-blue-500 font-bold text-lg">T</span>
          </div>
          <span className="text-xs text-gray-700">티맵</span>
        </div>
        
        {/* 카카오내비 */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => openNavApp('kakaoNavi')}
        >
          <div className="w-12 h-12 rounded-full bg-yellow-400 mb-1 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs text-gray-700">카카오내비</span>
        </div>
        
        {/* 네이버지도 */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => openNavApp('naverMap')}
        >
          <div className="w-12 h-12 rounded-full bg-[#1EC800] mb-1 flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xs text-gray-700">네이버지도</span>
        </div>
        
        {/* 카카오맵 */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => openNavApp('kakaoMap')}
        >
          <div className="w-12 h-12 rounded-full bg-yellow-400 mb-1 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs text-gray-700">카카오맵</span>
        </div>
      </div>
      
      {/* 지도 하단 정보 */}
      <div className="bg-gray-50 py-2 px-3 border-t border-gray-200 text-xs text-gray-600 text-center">
        충정로역 4번 출구에서 도보 5분 거리에 위치
      </div>
    </div>
  );
};

export default SimpleKakaoMap;