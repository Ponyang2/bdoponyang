'use client'

import { useEffect, useState } from 'react'
import { getBossImage } from '@/lib/utils/boss-image'
import WorldBossSchedule from './WorldBossSchedule'

interface ScheduleEntry {
  day: string
  time: string
  bosses: string[]
}

const DAY_INDEX = ['일', '월', '화', '수', '목', '금', '토']

export default function WorldBossCard() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [visibleSchedule, setVisibleSchedule] = useState<ScheduleEntry[]>([])
  const [index, setIndex] = useState(0)
  const [now, setNow] = useState(new Date())
  const [showSchedule, setShowSchedule] = useState(false)

  useEffect(() => {
    fetch('/api/world-boss')
      .then(res => res.json())
      .then((data: ScheduleEntry[]) => {
        const now = new Date()
        const nowDay = now.getDay()
        const nowTime = now.getTime()

        const allowedDays = [DAY_INDEX[nowDay], DAY_INDEX[(nowDay + 1) % 7]]

        const filtered = data.filter(entry => {
          const entryDayIndex = DAY_INDEX.indexOf(entry.day)
          if (!allowedDays.includes(entry.day)) return false

          const [h, m] = entry.time.split(':').map(Number)
          const entryDate = new Date(now)
          const dayDiff = (entryDayIndex - nowDay + 7) % 7
          entryDate.setDate(now.getDate() + dayDiff)
          entryDate.setHours(h, m, 0, 0)

          if (entry.day === DAY_INDEX[nowDay]) {
            return entryDate.getTime() > nowTime
          }
          return true
        })

        const sorted = filtered.sort((a, b) => {
          const getTimestamp = (entry: ScheduleEntry) => {
            const d = new Date(now)
            const dayDiff = (DAY_INDEX.indexOf(entry.day) - nowDay + 7) % 7
            d.setDate(d.getDate() + dayDiff)
            const [h, m] = entry.time.split(':').map(Number)
            d.setHours(h, m, 0, 0)
            return d.getTime()
          }
          return getTimestamp(a) - getTimestamp(b)
        })

        setSchedule(data)
        setVisibleSchedule(sorted)
        setIndex(0)
      })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!visibleSchedule.length) return null
  const current = visibleSchedule[index]

  const getCountdown = () => {
    const [h, m] = current.time.split(':').map(Number)
    const now = new Date()
    const entryDayIndex = DAY_INDEX.indexOf(current.day)
    const dayDiff = (entryDayIndex - now.getDay() + 7) % 7

    const target = new Date(now)
    target.setDate(now.getDate() + dayDiff)
    target.setHours(h, m, 0, 0)

    const diff = target.getTime() - now.getTime()
    if (diff <= 0) return '00:00:00'

    const hh = String(Math.floor(diff / 3600000)).padStart(2, '0')
    const mm = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
    const ss = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + visibleSchedule.length) % visibleSchedule.length)
  }

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % visibleSchedule.length)
  }

  const bossCount = current.bosses.length
  const sizeClass =
    bossCount === 1 ? 'w-40 h-48' :
    bossCount === 2 ? 'w-34 h-34' :
    bossCount === 3 ? 'w-34 h-34' :
    bossCount === 4 ? 'w-25 h-27' :
    'w-20 h-20'

  const layoutClass =
    bossCount <= 5 ? 'flex justify-center flex-wrap gap-8' :
    'grid grid-cols-2 gap-6 justify-center'

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-5 relative">
      <div className="mb-4 flex justify-center items-center relative">
        <h2 className="text-2xl font-bold text-white">🌍 월드 보스 시간표</h2>
        <button
          onClick={() => setShowSchedule(prev => !prev)}
          className="absolute right-0 text-sm bg-zinc-700 px-4 py-1.5 rounded hover:bg-zinc-600 transition"
        >
          전체 시간표 열기
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-6 py-6 text-center relative min-h-[280px]">
        {index > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-[130px] text-3xl text-white hover:text-gray-400"
          >
            &lt;
          </button>
        )}
        <button
          onClick={handleNext}
          className="absolute right-2 top-[130px] text-3xl text-white hover:text-gray-400"
        >
          &gt;
        </button>

        <h3 className="text-2xl font-bold text-white mb-6">
          ⏰ {current.day}요일 {current.time} 출현 예정 ⏰
        </h3>

        <div className={`${layoutClass} mb-6`}>
          {current.bosses.map((boss, idx) => (
            <div key={idx} className="min-w-[100px] text-center">
              <img
                src={getBossImage(boss)}
                alt={boss}
                className={`${sizeClass} mx-auto mb-3 rounded-full border border-zinc-600 bg-zinc-800`}
              />
              <div className="text-lg font-semibold text-white">{boss}</div>
            </div>
          ))}
        </div>

        <div className="text-lg text-gray-300">
          남은시간: <span className="text-white font-bold">{getCountdown()}</span>
        </div>
      </div>

      {showSchedule && (
        <div className="mt-6 text-center">
          <WorldBossSchedule />
        </div>
      )}
    </div>
  )
}
