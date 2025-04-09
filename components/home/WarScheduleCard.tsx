'use client'

export default function WarScheduleCard() {
  return (
    <div className="bg-zinc-800 rounded-lg shadow border border-zinc-700">
      <div className="text-center text-lg font-semibold py-3 border-b border-zinc-700">
        ⚔️ 거점/점령전 일정
      </div>
      <div className="p-4 text-gray-300 text-sm">
        {/* 추후 실제 데이터로 교체 예정 */}
        <p>수요일 - 거점전 20:00</p>
        <p>금요일 - 거점전 21:00</p>
        <p>토요일 - 점령전 20:00</p>
        <p>일요일 - 점령전 21:00</p>
      </div>
    </div>
  )
}
