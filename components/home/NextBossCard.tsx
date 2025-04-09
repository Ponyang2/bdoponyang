'use client'

import { useEffect, useState } from 'react'
import { getBossImage } from '@/lib/utils/boss-image'

interface ScheduleEntry {
  day: string      // ✅ 요일 추가
  time: string
  bosses: string[]
}


export default function NextBossCard() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [index, setIndex] = useState(0)
  const [now, setNow] = useState(new Date())

  // 전체 스케줄 불러오기
  useEffect(() => {
    fetch('/api/world-boss-schedule') // 전체 시간표 API (전체 시간대 순서대로)
      .then(res => res.json())
      .then(data => {
        setSchedule(data)

        // ⏱ 현재 시간 기준 가장 가까운 시간 index로 초기화
        const now = new Date()
        const currentTime = now.toTimeString().slice(0, 5)
        const currentDay = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()]
        const i = data.findIndex(
          (entry: ScheduleEntry) =>
            entry.day === currentDay && entry.time > currentTime
        )
        setIndex(i === -1 ? 0 : i)
      })
  }, [])

  // 실시간 남은 시간
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!schedule.length) return null

  const current = schedule[index]

  const getCountdown = () => {
    const [h, m] = current.time.split(':').map(Number)
    const target = new Date()
    target.setHours(h, m, 0, 0)
    const diff = target.getTime() - now.getTime()
    if (diff <= 0) return '00:00:00'

    const hh = String(Math.floor(diff / 3600000)).padStart(2, '0')
    const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
    const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + schedule.length) % schedule.length)
  }

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % schedule.length)
  }

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-5">
      <div className="mb-4 flex justify-between items-center">
        <button onClick={handlePrev} className="text-xl text-white">
          &lt;
        </button>
        <h2 className="text-2xl font-bold text-white text-center flex-1">
          ⏰ {current.time} 출현 예정 ⏰
        </h2>
        <button onClick={handleNext} className="text-xl text-white">
          &gt;
        </button>
      </div>

      <div className="flex justify-center flex-wrap gap-8 mb-6">
        {current.bosses.map((boss, idx) => (
          <div key={idx} className="min-w-[100px] text-center">
            <img
              src={getBossImage(boss)}
              alt={boss}
              className="w-20 h-20 mx-auto mb-3 rounded-full border border-zinc-600 bg-zinc-800"
            />
            <div className="text-lg font-semibold text-white">{boss}</div>
          </div>
        ))}
      </div>

      <div className="text-lg text-gray-300 text-center">
        남은시간: <span className="text-white font-bold">{getCountdown()}</span>
      </div>
    </div>
  )
}
