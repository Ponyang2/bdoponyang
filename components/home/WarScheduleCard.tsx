'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface RecentVictory {
  alliance_name: string
  war_date: string
  occupied_area: string
  region: string
}

const imageMap: Record<string, string> = {
  '칼페온': '/war-records/calfeon.png',
  '메디아': '/war-records/media.png',
  '발렌시아': '/war-records/balencia.png',
}

async function fetchRecentVictories(): Promise<RecentVictory[]> {
  const res = await fetch('/api/war-records/recent-victories')
  if (!res.ok) throw new Error('Failed to fetch recent victories')
  return res.json()
}

export default function WarScheduleCard() {
  const [recentVictories, setRecentVictories] = useState<RecentVictory[]>([])

  useEffect(() => {
    fetchRecentVictories()
      .then(data => setRecentVictories(data))
      .catch(() => setRecentVictories([]))
  }, [])

  const regions = ['칼페온', '메디아', '발렌시아']

  return (
    <div className="bg-zinc-800 rounded-lg shadow border border-zinc-700">
      <div className="text-left text-lg font-semibold py-3 border-b border-zinc-700 px-6 flex items-center gap-2">
        <span className="text-yellow-400 text-center text-xl">🏆</span> PvP 시간표
      </div>
      <div className="p-6 flex flex-col gap-6 bg-zinc-900">
        <div className="flex flex-row justify-center gap-8">
          {regions.map((region) => {
            const regionVictory = recentVictories
              .filter(v => v.region === region)
              .sort((a, b) => new Date(b.war_date).getTime() - new Date(a.war_date).getTime())[0]
            return (
              <div key={region} className="flex flex-col items-center bg-zinc-800 rounded-2xl p-6 w-64">
                <div className="relative w-[140px] h-[160px] mb-3">
                  <Image
                    src={imageMap[region]}
                    alt={region + ' 방패'}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
                <div className="text-xl font-bold text-white mb-1">{region}</div>
                <div className="text-base text-blue-300 font-semibold">
                  {regionVictory ? regionVictory.alliance_name : '최근 승리 기록 없음'}
                </div>
              </div>
            )
          })}
        </div>
        {/* 전쟁 일정 안내 */}
        <div className="space-y-1 text-center mt-4">
          <div><span className="font-semibold text-pink-300">다음 장미전쟁</span>: 5월 18일 (토) 18:00 시작 (2주에 1번)</div>
          <div><span className="font-semibold text-yellow-300">다음 점령전</span>: 매주 토요일 20:00 시작</div>
          <div><span className="font-semibold text-green-300">다음 거점전</span>: 토요일 제외 매일 21:00 시작</div>
        </div>
      </div>
    </div>
  )
}
