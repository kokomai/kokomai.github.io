import React, { useEffect, useState } from 'react';

const GetDomain: React.FC = () => {
  const [domain, setDomain] = useState<string>('');
  
  useEffect(() => {
    // 현재 도메인 정보를 가져옵니다
    setDomain(window.location.hostname);
  }, []);
  
  return (
    <div>
      <h3>현재 도메인 정보:</h3>
      <p>{domain}</p>
      <p>전체 URL: {window.location.href}</p>
      <p>프로토콜: {window.location.protocol}</p>
      <p>포트: {window.location.port}</p>
    </div>
  );
};

export default GetDomain;