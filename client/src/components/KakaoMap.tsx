import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  width?: string;
  height?: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ width = '100%', height = '100%' }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // API가 로드되었는지 확인하는 함수
    const checkAndInitMap = () => {
      // API 로드 에러 확인
      if ((window as any).kakaoMapLoadError) {
        console.error('카카오맵 API 로딩 중 오류가 발생했습니다. 도메인 허용 설정을 확인하세요.');
        return;
      }
      
      // 카카오맵 API가 로드되지 않은 경우 다시 시도
      if (!window.kakao || !window.kakao.maps) {
        console.log('카카오맵 API가 아직 로드되지 않았습니다. 0.5초 후 다시 시도합니다.');
        setTimeout(checkAndInitMap, 500);
        return;
      }
      
      // API가 로드되어 있으면 지도 초기화
      initializeMap();
    };
    
    // 지도 초기화 함수
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      try {
        console.log('카카오맵 초기화 시작...');
        
        // 루이비스웨딩 중구점 좌표
        const lat = 37.558624;
        const lng = 126.963829;
        
        // 지도 옵션 설정
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3
        };
        
        // 지도 생성
        const map = new window.kakao.maps.Map(mapRef.current, options);
        
        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
        
        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:5px;text-align:center;width:150px;font-weight:bold;">루이비스웨딩 중구점</div>'
        });
        infowindow.open(map, marker);
        
        console.log('카카오맵 초기화 완료!');
      } catch (error) {
        console.error('카카오맵 초기화 중 오류 발생:', error);
      }
    };
    
    // 초기화 시작
    checkAndInitMap();
  }, []);

  return (
    <div 
      id="map" 
      ref={mapRef} 
      style={{ width, height }}
    ></div>
  );
};

export default KakaoMap;