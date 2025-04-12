'use client'

import Image from 'next/image'
import { getTier } from '@/lib/utils/tier'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  rankChange?: string
}

interface Props {
  data: Entry[]
}

export default function SolareTable({ data }: Props) {
  // ✅ 중복 제거: name + score + class 조합으로 유일한 데이터만 남김
  const uniqueData = Array.from(
    new Map(data.map((d) => [`${d.name}-${d.score}-${d.class}`, d])).values()
  )

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full text-lg text-center border-separate border-spacing-y-2">
        <thead className="py-2 bg-gray-800 border-gray-700 text-white font-semibold">
          <tr className="border-b-2 border-white">
            <th className="px-3 py-2">순위</th>
            <th className="px-2 py-1">티어</th>
            <th className="px-2 py-1">가문명</th>
            <th className="px-2 py-1">전승/각성</th>
            <th className="px-2 py-1">클래스</th>
            <th className="px-2 py-1">승 / 무 / 패</th>
            <th className="px-2 py-1">승률</th>
            <th className="px-2 py-1">점수</th>
          </tr>
        </thead>
        <tbody>
          {uniqueData.map((entry, idx) => {
            const tier = getTier(entry.score)
            const change = entry.rankChange || '-'
            let changeColor = 'text-gray-400'
            if (change.startsWith('▲')) changeColor = 'text-red-500'
            else if (change.startsWith('▼')) changeColor = 'text-blue-500'
            else if (change === 'NEW') changeColor = 'text-green-600'

            return (
              <tr key={`${entry.name}-${entry.score}-${idx}`} className="border-b-2 border-white text-white">
                <td className="px-2 py-1 font-semibold flex items-center justify-center gap-1">
                  <span>{idx + 1}</span>
                  <span className={`text-xs ${changeColor}`}>{change}</span>
                </td>
                <td className="px-2 py-1">
                  <Image
                    src={`/solare-icons/${tier}.png`}
                    alt={`${tier} 티어 아이콘`}
                    width={40}
                    height={40}
                    className="mx-auto"
                  />
                </td>
                <td
                  className="px-2 py-1 font-semibold"
                  style={{
                    minWidth: '150px',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.name}
                </td>
                <td className="px-2 py-1 font-semibold">{entry.subclass}</td>
                <td className="px-2 py-1 font-semibold">{entry.class}</td>
                <td className="px-2 py-1 font-semibold">
                  {entry.wins}/{entry.draws}/{entry.losses}
                </td>
                <td className="px-2 py-1 font-semibold">
                  {entry.wins + entry.draws + entry.losses > 0
                    ? `${Math.round(
                        (entry.wins / (entry.wins + entry.draws + entry.losses)) * 100,
                      )}%`
                    : '-'}
                </td>
                <td className="px-2 py-1 font-semibold">{entry.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
