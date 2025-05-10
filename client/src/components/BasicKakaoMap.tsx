import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const BasicKakaoMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 카카오맵 API가 로드되었는지 확인하고 지도 초기화
    const initMap = () => {
      if (!mapContainer.current) return;
      
      // 루이비스웨딩 중구점 좌표
      const lat = 37.558624;
      const lng = 126.963829;
      
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3
      };
      
      // 지도 생성
      const map = new window.kakao.maps.Map(mapContainer.current, options);
      
      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        map: map
      });
      
      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: '<div style="padding:5px;font-size:12px;text-align:center;width:150px;font-weight:bold;">루이비스웨딩 중구점</div>'
      });
      infowindow.open(map, marker);
    };
    
    // 카카오맵 API가 이미 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      initMap();
    }
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
      {/* 지도 헤더 */}
      <div className="bg-gray-100 py-2 px-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-800">루이비스웨딩 중구점</h3>
          <p className="text-xs text-gray-500">서울 중구 청파로 463</p>
        </div>
        
        {/* 전화 버튼 */}
        <div 
          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shadow-md cursor-pointer"
          onClick={() => {
            if(window.confirm('신랑에게 전화를 거시겠습니까?')) {
              window.location.href = 'tel:010-9487-7336';
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </div>
      </div>
      
      {/* 지도 영역 */}
      <div 
        id="map"
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

export default BasicKakaoMap;