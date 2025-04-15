'use client'

import { useEffect, useState } from 'react'
import ClassSelector from '@/components/solare/ClassSelector'
import SolareTable from '@/components/solare/SolareTable'
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
  tier?: string // ⬅️ UI 표시용으로 클라이언트에서 추가
}

export default function SolareOverallPage() {
  const [data, setData] = useState<Entry[]>([])
  const [updateDate, setUpdateDate] = useState('')

  useEffect(() => {
    fetch('/api/solare-league/overall')
      .then(res => res.json())
      .then((raw: Entry[]) => {
        const withTier = raw.map(entry => ({
          ...entry,
          tier: getTier(entry.score)
        }))
        setData(withTier)
      })

    // Fetch the update date (KST)
    const currentDate = new Date()
    const kstDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
    setUpdateDate(kstDate.toISOString().split('T')[0]) // YYYY-MM-DD 형식으로 표시
  }, [])

  return (
    <div className="p-4 max-w-screen-xl mx-auto mt-4">
      <div className="flex justify-between text-sm text-white mb-4">
        <h1 className="text-3xl text-center font-bold mb-3">
          🌞 솔라레의 창 - 정규 시즌 랭킹 🌞
        </h1>
        <ClassSelector />
      </div>
      
      {/* 추가된 부분: 클래스 선택 버튼들 위에 업데이트 관련 표시 */}
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>⏰ 매일 오전 중에 업데이트 중입니다.</span>
        <span>📅 2025-04-12</span>
      </div>
      <SolareTable data={data} />
    </div>
  )
}
