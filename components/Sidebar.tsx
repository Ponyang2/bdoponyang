import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from './card'; // ✅ 같은 폴더 안에 있으므로 이렇게

const Sidebar = () => {
  return (
    <div className="w-full space-y-6">
      {/* 포냥이 추천 콘텐츠 */}
      <Card className="bg-zinc-900 border border-zinc-700 p-4 rounded-xl text-sm">
        <CardHeader>
          <CardTitle className="text-yellow-400 text-lg">✨ 포냥이 추천 콘텐츠</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>🔥 인기 가문: <strong>샤이공듀</strong></p>
          <p>🌟 인기 길드: <strong>밤하늘의별</strong></p>
          <p>⚔️ 추천 전장: <strong>붉은 전장</strong></p>
        </CardContent>
      </Card>

      {/* 미니 통계 위젯 */}
      <Card className="bg-zinc-900 border border-zinc-700 p-4 rounded-xl text-sm">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-lg">📊 실시간 통계</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p>🔎 실시간 검색 수: 1023건</p>
          <p>🏆 가장 많이 검색된 길드: <strong>천상계</strong></p>
          <p>🧙 인기 클래스: <strong>위자드</strong></p>
        </CardContent>
      </Card>

      {/* 포냥이의 팁 */}
      <Card className="bg-zinc-900 border border-zinc-700 p-4 rounded-xl text-sm">
        <CardHeader>
          <CardTitle className="text-pink-400 text-lg">💡 포냥이의 팁</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          매주 <strong>월요일 오전 10시</strong>에 길드 랭킹이 초기화돼요! <br />
          길드원 모집은 <strong>일요일에 미리 준비</strong>하세요!
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
