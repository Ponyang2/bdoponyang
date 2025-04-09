// components/home/MainBanner.tsx
import React from 'react';
import { Card, CardContent } from '../card';

const MainBanner = () => {
  return (
    <Card className="bg-zinc-800 text-center">
      <CardContent>
        <h2 className="text-2xl font-bold mb-2">🎉 검은사막 X Pearl Abyss</h2>
        <p className="text-gray-400">전장의 역사를 만들어보세요. 매주 업데이트되는 인기 콘텐츠!</p>
      </CardContent>
    </Card>
  );
};

export default MainBanner;