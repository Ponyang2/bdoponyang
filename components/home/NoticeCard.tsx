// components/home/NoticeCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../card';

const NoticeCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-red-400">📢 공지사항</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-400 space-y-1">
        <p>2025.04.03 서버 점검 안내</p>
        <p>2025.03.27 신규 길드 기능 추가</p>
      </CardContent>
    </Card>
  );
};

export default NoticeCard;