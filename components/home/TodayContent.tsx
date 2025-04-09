// components/home/TodayContent.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../card';

const TodayContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-yellow-400">🔥 오늘의 추천 콘텐츠</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-400 space-y-1">
        <p>📍 오늘의 전장: 붉은 전장</p>
        <p>🏆 인기 길드: 천상계</p>
        <p>🧙 추천 클래스: 위치</p>
      </CardContent>
    </Card>
  );
};

export default TodayContent;