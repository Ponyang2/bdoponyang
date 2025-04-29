import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from './card'; // ✅ 같은 폴더 안에 있으므로 이렇게

const Sidebar = () => {
  return (
    <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
      {/* 포냥이 추천 콘텐츠 */}
      <Card className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center gap-2 mb-2">
          <span className="text-2xl">✨</span>
          <CardTitle className="text-yellow-300 text-lg font-bold tracking-tight">포냥이 추천 콘텐츠</CardTitle>
        </CardHeader>
        <CardContent className="text-base space-y-1 text-zinc-100">
          <p>🔥 <span className="font-semibold">인기 가문:</span> 샤이공듀</p>
          <p>🌟 <span className="font-semibold">인기 길드:</span> 밤하늘의별</p>
          <p>⚔️ <span className="font-semibold">추천 전장:</span> 붉은 전장</p>
        </CardContent>
      </Card>

      {/* 미니 통계 위젯 */}
      <Card className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center gap-2 mb-2">
          <span className="text-2xl">📊</span>
          <CardTitle className="text-cyan-300 text-lg font-bold tracking-tight">실시간 통계</CardTitle>
        </CardHeader>
        <CardContent className="text-base space-y-1 text-zinc-100">
          <p>🔎 <span className="font-semibold">실시간 검색 수:</span> 1023건</p>
          <p>🏆 <span className="font-semibold">가장 많이 검색된 길드:</span> 천상계</p>
          <p>🧙 <span className="font-semibold">인기 클래스:</span> 위자드</p>
        </CardContent>
      </Card>

      {/* 포냥이의 팁 */}
      <Card className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200">
        <CardHeader className="flex flex-row items-center gap-2 mb-2">
          <span className="text-2xl">💡</span>
          <CardTitle className="text-pink-300 text-lg font-bold tracking-tight">포냥이의 팁</CardTitle>
        </CardHeader>
        <CardContent className="text-base text-zinc-100">
          매주 <span className="font-semibold text-pink-200">월요일 오전 10시</span>에 길드 랭킹이 초기화돼요! <br />
          길드원 모집은 <span className="font-semibold text-pink-200">일요일에 미리 준비</span>하세요!
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
