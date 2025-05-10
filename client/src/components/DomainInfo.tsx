import React, { useEffect, useState } from 'react';

const DomainInfo: React.FC = () => {
  const [domain, setDomain] = useState<string>('');
  const [ip, setIp] = useState<string>('');

  useEffect(() => {
    // 현재 도메인 정보 가져오기
    setDomain(window.location.hostname);
    
    // 공용 IP 정보 API 호출
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setIp(data.ip);
      })
      .catch(error => {
        console.error('IP 정보를 가져오는 중 오류 발생:', error);
        setIp('확인 불가');
      });
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">도메인 정보</h2>
      <p><strong>현재 도메인:</strong> {domain}</p>
      <p><strong>공용 IP:</strong> {ip}</p>
      <p className="mt-3 text-sm text-gray-600">
        이 정보를 카카오 개발자 센터에서 'JavaScript 키 사용 제한 설정'에 등록해주세요.<br />
        도메인은 <span className="font-mono">*.{domain}</span> 형식으로 등록하시면 됩니다.
      </p>
    </div>
  );
};

export default DomainInfo;