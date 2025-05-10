import React from 'react';
import { motion } from 'framer-motion';
import { Page } from '@/lib/types';

// 패턴 이미지 import
import patternImage from '@assets/pattern.png';
import InfiniteCarousel from './InfiniteCarousel';
import KakaoMapWithButtons from './KakaoMapWithButtons';
import DomainInfo from './DomainInfo';

interface PageContentProps {
  currentPage: Page;
  isTransitioning: boolean;
  onGoHome: () => void;
}

const PageContent: React.FC<PageContentProps> = ({ currentPage, isTransitioning, onGoHome }) => {
  // Animation variants for page transitions
  const pageVariants = {
    enter: { opacity: 0, y: 50 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  // Transition settings
  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5,
  };

  return (
    <div className="h-[calc(100%-30px)] flex flex-col items-center justify-start px-1 xs:px-2 sm:px-3 relative overflow-hidden">
      <motion.div
        key={currentPage}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={pageTransition}
        className="w-full h-full flex flex-col items-center justify-center px-0 xs:px-1 sm:px-2 pt-0"
      >
        {/* Content area - hidden on page 6 */}
        {currentPage !== Page.PAGE6 && (
          <div className="w-full h-full flex flex-col items-center justify-center py-0 -mt-4">
            {/* 패턴 헤더 - 첫 페이지에만 표시 */}
            {currentPage === Page.PAGE1 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-[45%] xs:w-1/2 mx-auto mb-0 xs:mb-1 sm:mb-2 mt-0"
              >
                <img 
                  src={patternImage} 
                  alt="Decorative pattern" 
                  className="w-full h-auto object-contain filter contrast-125 brightness-110"
                  style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))'
                  }}
                />
              </motion.div>
            )}
            
            {/* 패턴 헤더 - 2페이지에도 표시 */}
            {currentPage === Page.PAGE2 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-[45%] xs:w-1/2 mx-auto mb-0 xs:mb-1 sm:mb-2 mt-0"
              >
                <img 
                  src={patternImage} 
                  alt="Decorative pattern" 
                  className="w-full h-auto object-contain filter contrast-125 brightness-110"
                  style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))'
                  }}
                />
              </motion.div>
            )}
            
            {/* 패턴 헤더 - 3, 5페이지에 표시 */}
            {(currentPage === Page.PAGE3 || currentPage === Page.PAGE5) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-[45%] xs:w-1/2 mx-auto mb-0 xs:mb-1 sm:mb-2 mt-0"
              >
                <img 
                  src={patternImage} 
                  alt="Decorative pattern" 
                  className="w-full h-auto object-contain filter contrast-125 brightness-110"
                  style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.9))'
                  }}
                />
              </motion.div>
            )}
            
            {/* Wedding image - Page 1 */}
            {currentPage === Page.PAGE1 && (
              <div className="w-[92%] h-[28vh] xs:h-[30vh] sm:h-[32vh] md:h-[34vh] lg:h-[32vh] xl:h-[30vh] max-h-[350px] bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <p className="text-gray-400 font-korean">웨딩 사진 1</p>
              </div>
            )}
            
            {/* 이미지 캐러셀 - Page 3 */}
            {currentPage === Page.PAGE3 && (
              <div className="w-full flex flex-col space-y-4 mt-1 xs:mt-2 sm:mt-3 md:mt-4 lg:mt-4">
                {/* 첫 번째 캐러셀 - 왼쪽에서 오른쪽으로 */}
                <div className="w-full mx-auto">
                  <InfiniteCarousel direction="ltr" speed={0.8} imageSet="set1" />
                </div>
                
                {/* 두 번째 캐러셀 - 오른쪽에서 왼쪽으로 */}
                <div className="w-full mx-auto mt-3">
                  <InfiniteCarousel direction="rtl" speed={0.6} imageSet="set2" />
                </div>
              </div>
            )}
            
            {/* 패턴 헤더 - 4페이지용 */}
            {currentPage === Page.PAGE4 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="w-[45%] xs:w-1/2 mx-auto mb-0 xs:mb-1 sm:mb-2"
                style={{ marginTop: '1rem' }}
              >
                <img 
                  src={patternImage} 
                  alt="Decorative pattern" 
                  className="w-full h-auto object-contain filter contrast-125 brightness-110"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))' }}
                />
              </motion.div>
            )}
            
            {/* 지도 - Page 4 */}
            {currentPage === Page.PAGE4 && (
              <>
                {/* 오시는 길 타이틀 */}
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold">오시는 길</h2>
                </div>
                
                <div className="w-[92%] h-[64vh] xs:h-[68vh] sm:h-[70vh] md:h-[72vh] lg:h-[75vh] xl:h-[75vh] max-h-[750px] bg-white rounded-lg overflow-hidden mx-auto mb-1 sm:mb-3 mt-0">
                  <KakaoMapWithButtons />
                </div>
              </>
            )}
            
            {/* 5페이지 웨딩 사진 제거 */}

            {/* Text area - 1페이지 */}
            {currentPage === Page.PAGE1 && (
              <div className="text-center mt-2 w-11/12 sm:w-4/5 md:w-3/4 max-w-xl">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-[#333] font-serif">결혼합니다</h1>
                <p className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-xl text-gray-700 font-korean font-light mb-3 sm:mb-4 md:mb-5">
                  2025년 9월 20일 토요일 오후 6시
                </p>
                <p className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-xl text-gray-700 font-korean font-light">
                  서울 중구 청파로 463<br/>
                  루이비스웨딩 중구점 18F
                </p>
              </div>
            )}
            
            {/* Text area - 5페이지 */}
            {currentPage === Page.PAGE5 && (
              <div className="text-center mt-2 xs:mt-2 sm:mt-2 md:mt-2 lg:mt-2 w-11/12 sm:w-4/5 md:w-3/4 max-w-xl">
                {/* 달력 - 9월 20일 표시 */}
                <div className="mb-3 flex justify-center">
                  <div className="w-[240px] max-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="p-1 bg-gray-200 border-b border-gray-300 rounded-t-lg">
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-800">2025년 9월</span>
                        <span className="text-xs text-gray-600 ml-2">PM 6:00</span>
                      </div>
                    </div>
                    <div className="p-1.5">
                      {/* 요일 헤더 */}
                      <div className="grid grid-cols-7 gap-1 mb-0.5 text-center">
                        <div className="text-[10px] font-medium text-pink-400">일</div>
                        <div className="text-[10px] font-medium text-gray-600">월</div>
                        <div className="text-[10px] font-medium text-gray-600">화</div>
                        <div className="text-[10px] font-medium text-gray-600">수</div>
                        <div className="text-[10px] font-medium text-gray-600">목</div>
                        <div className="text-[10px] font-medium text-gray-600">금</div>
                        <div className="text-[10px] font-medium text-blue-400">토</div>
                      </div>
                      
                      {/* 날짜 그리드 */}
                      <div className="grid grid-cols-7 gap-0.5 text-center">
                        {/* 첫째 주 - 이전 달 날짜와 1~6일 */}
                        <div></div>
                        <div className="py-0.5 text-xs text-gray-500">1</div>
                        <div className="py-0.5 text-xs text-gray-500">2</div>
                        <div className="py-0.5 text-xs text-gray-500">3</div>
                        <div className="py-0.5 text-xs text-gray-500">4</div>
                        <div className="py-0.5 text-xs text-gray-500">5</div>
                        <div className="py-0.5 text-xs text-blue-400">6</div>
                        
                        {/* 둘째 주 - 7~13일 */}
                        <div className="py-0.5 text-xs text-pink-400">7</div>
                        <div className="py-0.5 text-xs text-gray-500">8</div>
                        <div className="py-0.5 text-xs text-gray-500">9</div>
                        <div className="py-0.5 text-xs text-gray-500">10</div>
                        <div className="py-0.5 text-xs text-gray-500">11</div>
                        <div className="py-0.5 text-xs text-gray-500">12</div>
                        <div className="py-0.5 text-xs text-blue-400">13</div>
                        
                        {/* 셋째 주 - 14~20일 */}
                        <div className="py-0.5 text-xs text-pink-400">14</div>
                        <div className="py-0.5 text-xs text-gray-500">15</div>
                        <div className="py-0.5 text-xs text-gray-500">16</div>
                        <div className="py-0.5 text-xs text-gray-500">17</div>
                        <div className="py-0.5 text-xs text-gray-500">18</div>
                        <div className="py-0.5 text-xs text-gray-500">19</div>
                        <div className="p-0.5 text-xs font-bold text-white shadow-sm transform scale-105 relative flex items-center justify-center">
                          <svg className="absolute w-7 h-7 text-red-500 translate-y-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="z-10">20</span>
                        </div>
                        
                        {/* 넷째 주 - 21~27일 */}
                        <div className="py-0.5 text-xs text-pink-400">21</div>
                        <div className="py-0.5 text-xs text-gray-500">22</div>
                        <div className="py-0.5 text-xs text-gray-500">23</div>
                        <div className="py-0.5 text-xs text-gray-500">24</div>
                        <div className="py-0.5 text-xs text-gray-500">25</div>
                        <div className="py-0.5 text-xs text-gray-500">26</div>
                        <div className="py-0.5 text-xs text-blue-400">27</div>
                        
                        {/* 다섯째 주 - 28~30일 */}
                        <div className="py-0.5 text-xs text-pink-400">28</div>
                        <div className="py-0.5 text-xs text-gray-500">29</div>
                        <div className="py-0.5 text-xs text-gray-500">30</div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 계좌번호 정보 */}
                <div className="mt-2 space-y-3">
                  {/* 신랑측 계좌 */}
                  <div className="text-center">
                    <p className="text-base font-bold mb-3 py-0 bg-blue-100 rounded-lg">신랑측 마음전하실 곳</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-serif">110-370-309375 (신한은행) 김현우</span>
                      <button 
                        className="bg-white text-blue-700 px-2 py-0.5 rounded text-xs hover:bg-blue-50 border border-blue-300 shadow-sm"
                        onClick={() => {
                          navigator.clipboard.writeText('110-370-309375');
                          alert('계좌번호가 복사되었습니다.');
                        }}
                      >
                        계좌복사
                      </button>
                    </div>
                    {/* 부모님 계좌번호 추가 */}
                    <div className="mt-2 flex flex-col gap-1">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm font-serif">000-0000-0000 (우리은행) 김순환</span>
                        <button 
                          className="bg-white text-blue-700 px-2 py-0.5 rounded text-xs hover:bg-blue-50 border border-blue-300 shadow-sm"
                          onClick={() => {
                            navigator.clipboard.writeText('000-0000-0000');
                            alert('계좌번호가 복사되었습니다.');
                          }}
                        >
                          계좌복사
                        </button>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm font-serif">010-2970-5337 (IBK기업은행) 서현경</span>
                        <button 
                          className="bg-white text-blue-700 px-2 py-0.5 rounded text-xs hover:bg-blue-50 border border-blue-300 shadow-sm"
                          onClick={() => {
                            navigator.clipboard.writeText('010-2970-5337');
                            alert('계좌번호가 복사되었습니다.');
                          }}
                        >
                          계좌복사
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 신부측 계좌 */}
                  <div className="text-center pt-2 border-t border-gray-200 mt-2">
                    <p className="text-base font-bold mb-3 py-0 bg-pink-100 rounded-lg">신부측 마음전하실 곳</p>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-serif">1000-5636-0782 (토스뱅크) 최민정</span>
                      <button 
                        className="bg-white text-pink-700 px-2 py-0.5 rounded text-xs hover:bg-pink-50 border border-pink-300 shadow-sm"
                        onClick={() => {
                          navigator.clipboard.writeText('1000-5636-0782');
                          alert('계좌번호가 복사되었습니다.');
                        }}
                      >
                        계좌복사
                      </button>
                    </div>
                    {/* 부모님 계좌번호 추가 */}
                    <div className="mt-2 flex flex-col gap-1">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm font-serif">000-0000-0000 (우리은행) 최상덕</span>
                        <button 
                          className="bg-white text-pink-700 px-2 py-0.5 rounded text-xs hover:bg-pink-50 border border-pink-300 shadow-sm"
                          onClick={() => {
                            navigator.clipboard.writeText('000-0000-0000');
                            alert('계좌번호가 복사되었습니다.');
                          }}
                        >
                          계좌복사
                        </button>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm font-serif">010-3218-0996 (IBK기업은행) 손낙영</span>
                        <button 
                          className="bg-white text-pink-700 px-2 py-0.5 rounded text-xs hover:bg-pink-50 border border-pink-300 shadow-sm"
                          onClick={() => {
                            navigator.clipboard.writeText('010-3218-0996');
                            alert('계좌번호가 복사되었습니다.');
                          }}
                        >
                          계좌복사
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 4페이지 텍스트 영역 삭제됨 */}
            
            {/* Text area - 3페이지 */}
            {currentPage === Page.PAGE3 && (
              <div className="text-center mt-2 xs:mt-2 sm:mt-2 md:mt-2 lg:mt-2 w-11/12 sm:w-4/5 md:w-3/4 max-w-xl">
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-2xl lg:text-2xl font-medium text-gray-800 font-korean mb-2 sm:mb-3 md:mb-4">
                  우리의 이야기
                </h2>
                <p className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-xl text-gray-700 font-korean mb-6 sm:mb-8 md:mb-10 leading-relaxed">
                  9년의 시간을 같이 보내고<br /> 
                  이제 부부로서 걸어가려는<br />
                  저희들의 소중한 순간을 함께 해 주세요.
                </p>
              </div>
            )}
            
            {/* Text area - 2페이지 */}
            {currentPage === Page.PAGE2 && (
              <div className="text-center mt-2 xs:mt-3 sm:mt-4 md:mt-6 lg:mt-8 w-[98%] xs:w-11/12 sm:w-4/5 md:w-3/4 max-w-xl">
                <p className="responsive-text-base text-gray-700 font-korean mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                  고등학생때 편지를 주고받으며 서로를 알게되었고,<br/>
                  찬란한 24살, 같이 손을 맞잡게 되었습니다<br/>
                  삶의 길을 여러번 바꿨을 때도 함께였고,<br/>
                  지금의 모습으로 이 자리에 서게 되었습니다
                </p>
                
                <p className="responsive-text-base text-gray-700 font-korean mb-2 sm:mb-3 md:mb-4 leading-relaxed mt-2">
                  9년간 친구에서 연인으로 같이 자랐고,<br/>
                  이제는 부부로 함께하려고 합니다.<br/>
                  부디 참석하셔서 축하해주시면 감사하겠습니다.
                </p>
                
                {/* 신랑 신부 연락처 */}
                <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 flex flex-col space-y-0 xs:space-y-1 items-center justify-center">
                  <div className="text-center mb-1 xs:mb-2 bg-yellow-50 py-1 xs:py-2 rounded-lg w-full">
                    <h3 className="responsive-text-lg font-semibold text-gray-800">신랑·신부에게 연락하기</h3>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-2 w-full">
                    <div 
                      className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-50"
                      onClick={() => {
                        if (window.confirm('신랑 김현우 (010-9487-7336) 에게 전화를 거시겠습니까?')) {
                          window.location.href = 'tel:010-9487-7336';
                        }
                      }}
                    >
                      <span className="responsive-text-lg font-medium text-gray-800">신랑 김현우</span>
                      <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 xs:h-3 xs:w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-50"
                      onClick={() => {
                        if (window.confirm('신부 최민정 (010-6249-9302) 에게 전화를 거시겠습니까?')) {
                          window.location.href = 'tel:010-6249-9302';
                        }
                      }}
                    >
                      <span className="responsive-text-lg font-medium text-gray-800">신부 최민정</span>
                      <div className="w-5 h-5 xs:w-6 xs:h-6 rounded-full bg-pink-100 flex items-center justify-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 xs:h-3 xs:w-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 혼주 정보 */}
                <div className="mt-0 xs:mt-1 sm:mt-2 md:mt-3 flex flex-col space-y-0 xs:space-y-1 w-full max-w-md">
                  <div className="text-center mb-1 xs:mb-1 sm:mb-2 bg-yellow-50 py-1 xs:py-1 rounded-lg">
                    <h3 className="responsive-text-lg font-semibold text-gray-800">혼주에게 연락하기</h3>
                  </div>
                  
                  <div className="flex justify-between gap-1 xs:gap-2 sm:gap-3 p-0 xs:p-1">
                    {/* 신랑 측 혼주 */}
                    <div className="flex-1">
                      <p className="responsive-text-base text-gray-700 mb-0 xs:mb-1 sm:mb-2 text-center font-medium">신랑 측</p>
                      
                      <div 
                        className="flex items-center justify-center mb-1 xs:mb-2 sm:mb-3"
                        onClick={() => {
                          if (window.confirm('신랑 아버지 (010-6353-5837) 에게 전화를 거시겠습니까?')) {
                            window.location.href = 'tel:010-6353-5837';
                          }
                        }}
                      >
                        <span className="responsive-text-base text-gray-500 mr-1 xs:mr-2">아버지</span>
                        <span className="responsive-text-base font-medium text-gray-800 mr-1">김순환</span>
                        <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-green-100 flex items-center justify-center cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div 
                        className="flex items-center justify-center"
                        onClick={() => {
                          if (window.confirm('신랑 어머니 서현경 (010-2970-5337) 에게 전화를 거시겠습니까?')) {
                            window.location.href = 'tel:010-2970-5337';
                          }
                        }}
                      >
                        <span className="responsive-text-base text-gray-500 mr-1 xs:mr-2">어머니</span>
                        <span className="responsive-text-base font-medium text-gray-800 mr-1">서현경</span>
                        <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-green-100 flex items-center justify-center cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* 신부 측 혼주 */}
                    <div className="flex-1">
                      <p className="responsive-text-base text-gray-700 mb-0 xs:mb-1 sm:mb-2 text-center font-medium">신부 측</p>
                      
                      <div 
                        className="flex items-center justify-center mb-1 xs:mb-2 sm:mb-3"
                        onClick={() => {
                          if (window.confirm('신부 아버지 최상덕 (010-5495-0996) 에게 전화를 거시겠습니까?')) {
                            window.location.href = 'tel:010-5495-0996';
                          }
                        }}
                      >
                        <span className="responsive-text-base text-gray-500 mr-1 xs:mr-2">아버지</span>
                        <span className="responsive-text-base font-medium text-gray-800 mr-1">최상덕</span>
                        <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-green-100 flex items-center justify-center cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div 
                        className="flex items-center justify-center"
                        onClick={() => {
                          if (window.confirm('신부 어머니 손낙영 (010-3218-0996) 에게 전화를 거시겠습니까?')) {
                            window.location.href = 'tel:010-3218-0996';
                          }
                        }}
                      >
                        <span className="responsive-text-base text-gray-500 mr-1 xs:mr-2">어머니</span>
                        <span className="responsive-text-base font-medium text-gray-800 mr-1">손낙영</span>
                        <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-green-100 flex items-center justify-center cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                

              </div>
            )}

            {/* Names - 1페이지에만 표시 */}
            {currentPage === Page.PAGE1 && (
              <div className="flex justify-center w-full mt-5 xs:mt-6 sm:mt-8 md:mt-10 lg:mt-10">
                <div className="text-center px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12">
                  <p className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-xl font-medium text-gray-800 font-korean mb-1 sm:mb-2">김현우</p>
                  <p className="text-xs xs:text-xs sm:text-sm md:text-sm lg:text-sm text-gray-600 font-korean">김순환・서현경의 장남</p>
                </div>
                <div className="text-center px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12">
                  <p className="text-base xs:text-lg sm:text-xl md:text-xl lg:text-xl font-medium text-gray-800 font-korean mb-1 sm:mb-2">최민정</p>
                  <p className="text-xs xs:text-xs sm:text-sm md:text-sm lg:text-sm text-gray-600 font-korean">최상덕・손낙영의 장녀</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* For page 6, we'll have a special empty space to allow DotArea to be centered */}
        {currentPage === Page.PAGE6 && (
          <div className="w-full flex-1 flex items-center justify-center">
            {/* This div is intentionally empty to make space for the centered dot area */}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PageContent;