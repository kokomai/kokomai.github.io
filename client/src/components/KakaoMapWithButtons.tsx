import React from 'react';
import KakaoMap from './KakaoMap';

const KakaoMapWithButtons: React.FC = () => {
  // 네비게이션 앱 열기 함수
  const openNavApp = (app: string) => {
    const lat = 37.558624;
    const lng = 126.963829;
    const name = '루이비스웨딩 중구점 18F';
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
      case 'copy':
        navigator.clipboard.writeText('서울 중구 청파로 463');
        alert('주소가 복사되었습니다');
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
          <h3 className="text-lg font-medium text-gray-800">루이비스웨딩 중구점 18F</h3>
          <p className="text-xs text-gray-500">서울 중구 청파로 463</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 주소 복사 버튼 */}
          <div 
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer border border-gray-300"
            onClick={() => openNavApp('copy')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
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
      </div>
      
      {/* 지도 영역 */}
      <div className="flex-1">
        <KakaoMap height="100%" />
      </div>
      
      {/* 주소 및 정보 - 컴팩트하게 수정 */}
      <div className="bg-white py-2 px-2 border-t border-gray-200" style={{ maxHeight: '35vh', overflowY: 'auto' }}>
        
        <div className="mt-2 space-y-2">
          <div className="bg-gray-50 py-1 px-2 rounded border border-gray-200">
            <p className="text-xs md:text-sm text-gray-600">
              <span className="font-medium">셔틀버스 이용</span><br />
              서울역 하차, 서부역 롯데마트 앞 10분 배차 운행
            </p>
          </div>
          
          <div className="bg-gray-50 py-1 px-2 rounded border border-gray-200">
            <p className="text-xs md:text-sm text-gray-600">
              <span className="font-medium">지하철</span><br />
              충정로역 4번 출구에서 도보 3분, 한국경제신문사
            </p>
          </div>
          
          <div className="bg-gray-50 py-1 px-2 rounded border border-gray-200">
            <p className="text-xs md:text-sm text-gray-600">
              <span className="font-medium">주차</span><br />
              "한국경제신문사" 입력, 본 건물 내 지하주차장 이용<br />
              {'\u2192'} 2시간 무료, 정산 없이 출차 가능
            </p>
          </div>
        </div>
        

      </div>
      

    </div>
  );
};

export default KakaoMapWithButtons;