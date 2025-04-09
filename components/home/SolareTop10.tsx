'use client'

export default function SolareTop10() {
  return (
    <div className="bg-zinc-800 rounded-lg shadow border border-zinc-700">
      <div className="text-center text-lg font-semibold py-3 border-b border-zinc-700">
        🌟 솔라레 랭킹 TOP 10
      </div>
      <div className="p-4 text-gray-300 text-sm">
        {/* 추후 크롤링된 데이터로 교체 가능 */}
        <p>1위 - 솔라레킹</p>
        <p>2위 - 검투사짱</p>
        <p>3위 - 미스틱마스터</p>
        <p>4위 - 레인저갓</p>
        <p>5위 - 암살의전설</p>
        <p>6위 - 수라킹</p>
        <p>7위 - 모험가짱</p>
        <p>8위 - 아처짱</p>
        <p>9위 - 팔라딘</p>
        <p>10위 - 거너짱</p>
      </div>
    </div>
  )
}
