// components/home/CouponCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../card';

const CouponCard = () => {
  return (
    <Card>
      <CardContent className="text-sm text-gray-400">
        최신 쿠폰: <strong>APRIL2025</strong><br />
        [게임 내 쿠폰 입력창에서 등록]
      </CardContent>
    </Card>
  );
};

export default CouponCard;