import React from 'react';

// 네비게이션 앱 열기 함수
const openNavApp = (app: string, lat: number = 37.5548, lng: number = 126.9370, name: string = '루이비스웨딩 중구점') => {
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
    case 'call':
      if(window.confirm('루이비스웨딩 중구점 (02-312-6800) 에게 전화를 거시겠습니까?')) {
        window.location.href = 'tel:02-312-6800';
      }
      break;
    default:
      break;
  }
};

// 지도와 버튼 컴포넌트
const MapWithButtons: React.FC = () => {
  // 루이비스웨딩 중구점 좌표 - 네이버 지도에서 가져온 확실한 값
  const lat = 37.558624;
  const lng = 126.963829;
  
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col">
      {/* 지도 헤더 */}
      <div className="bg-gray-100 py-2 px-3 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-800">루이비스웨딩 중구점</h3>
          <p className="text-xs text-gray-500">서울 중구 청파로 463</p>
        </div>
        
        {/* 전화 버튼 */}
        <div 
          className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center shadow-md cursor-pointer"
          onClick={() => openNavApp('call')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
        </div>
      </div>
      
      {/* 지도 영역 - 네이버 스태틱 지도 */}
      <div className="flex-1 relative">
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAGrQT0QvOkOtq0wIyQn9v6aVvGSiODYWs&q=${lat},${lng}&zoom=16`}
          allowFullScreen 
          className="absolute inset-0"
        ></iframe>
        
        {/* 마커 오버레이 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-8 z-10 pointer-events-none">
          <div className="flex flex-col items-center">
            <div className="bg-white px-2 py-1 rounded shadow-md mb-1 text-xs font-medium">
              루이비스웨딩 중구점
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="w-2 h-2 bg-red-500 rotate-45 -mt-0.5 z-0"></div>
          </div>
        </div>
      </div>
      
      {/* 내비게이션 바로가기 버튼 */}
      <div className="bg-white pt-2 pb-3 px-2 border-t border-gray-200 grid grid-cols-4 gap-1 text-center">
        {/* 티맵 */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => openNavApp('tmap', lat, lng)}
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 mb-1 flex items-center justify-center">
            <span className="text-blue-500 font-bold text-lg">T</span>
          </div>
          <span className="text-xs text-gray-700">티맵</span>
        </div>
        
        {/* 카카오내비 */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => openNavApp('kakaoNavi', lat, lng)}
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
          onClick={() => openNavApp('naverMap', lat, lng)}
        >
          <div className="w-12 h-12 rounded-full bg-[#1EC800] mb-1 flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xs text-gray-700">네이버지도</span>
        </div>
        
        {/* 카카오맵 */}
        <div 
          className="flex flex-col items-center cursor-pointer"
          onClick={() => openNavApp('kakaoMap', lat, lng)}
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

export default MapWithButtons;