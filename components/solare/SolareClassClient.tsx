'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import classList from '@/lib/constants/class-list'
import SolareTable from './SolareTable'
import ClassSelector from './ClassSelector'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  tier: string
  rankChange?: string // ✅ 순위 변동
}

export default function SolareClassClient() {
  const params = useParams()
  const className = decodeURIComponent(params?.class as string || '')
  const [data, setData] = useState<Entry[] | null>(null)
  const [error, setError] = useState(false)
  const [updateDate, setUpdateDate] = useState('')

  useEffect(() => {
    if (!classList.includes(className)) {
      setError(true)
      return
    }

    fetch(`/api/solare-league/${encodeURIComponent(className)}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setData)
      .catch(() => setError(true))

    // Fetch the update date (KST)
    const currentDate = new Date()
    const kstDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
    setUpdateDate(kstDate.toISOString().split('T')[0]) // YYYY-MM-DD 형식으로 표시
  }, [className])

  if (error) return <div className="p-4 max-w-5xl mx-auto">존재하지 않는 클래스입니다.</div>
  if (!data) return <div className="p-4 max-w-5xl mx-auto">불러오는 중...</div>

  return (
    <div className="p-4 max-w-screen-xl mx-auto mt-4">
      <div className="flex justify-between text-sm text-white mb-4">
        <h1 className="text-3xl text-center font-bold mb-3">
          🌞 솔라레의 창 - {className} 랭킹 🌞
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
