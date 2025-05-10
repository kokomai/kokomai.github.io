import React from 'react';
import { motion } from 'framer-motion';

const WeddingInvitation: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Placeholder for wedding image - adjusted size and position */}
      <div className="w-4/5 h-80 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6 mt-6">
        <p className="text-gray-400 font-korean">웨딩 사진</p>
      </div>

      {/* Wedding Title - adjusted spacing */}
      <div className="text-center mb-10 mt-8">
        <h1 className="text-5xl font-bold mb-10 text-[#333] font-serif">결혼합니다</h1>
        <p className="text-xl text-gray-700 font-korean font-light mb-3">
          2024년 6월 15일 토요일 오후 2시
        </p>
        <p className="text-lg text-gray-600 mt-3 font-korean">
          서울 강남구 테헤란로 123 웨딩홀
        </p>
      </div>

      {/* Names */}
      <div className="flex justify-center w-full mt-8">
        <div className="text-center px-10">
          <p className="text-xl font-medium text-gray-800 font-korean">김철수</p>
          <p className="text-sm text-gray-600 font-korean">김OO・박OO의 장남</p>
        </div>
        <div className="text-center px-10">
          <p className="text-xl font-medium text-gray-800 font-korean">이영희</p>
          <p className="text-sm text-gray-600 font-korean">이OO・최OO의 장녀</p>
        </div>
      </div>
    </div>
  );
};

export default WeddingInvitation;