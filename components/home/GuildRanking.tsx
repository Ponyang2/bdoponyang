// components/home/GuildRanking.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../card';

const GuildRanking = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-cyan-400">🏅 길드 랭킹</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-400 space-y-1">
        <p>1위: 천상계 - 98명</p>
        <p>2위: 불사조 - 95명</p>
        <p>3위: 광휘단 - 90명</p>
      </CardContent>
    </Card>
  );
};

export default GuildRanking;
