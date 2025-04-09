'use client'

import React, { useEffect, useState } from 'react'

interface WorldBossEntry {
  day: string
  time: string
  bosses: string[]
}

const days = ['월', '화', '수', '목', '금', '토', '일']
const times = [
  '00:15', '02:00', '11:00', '14:00',
  '16:00', '17:00', '19:00', '20:00',
  '23:15', '23:45'
]

export default function WorldBossSchedule() {
  const [data, setData] = useState<WorldBossEntry[]>([])

  useEffect(() => {
    fetch('/api/world-boss')
      .then(res => res.json())
      .then(data => setData(data))
  }, [])

  const getBosses = (day: string, time: string) => {
    const match = data.find(d => d.day === day && d.time === time)
    return match ? match.bosses.join('\n') : ''
  }

  return (
    <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700 mt-4 text-center">
      {/* 가운데 정렬을 위한 text-center 적용 */}
      <div className="mb-3">
        <h2 className="text-xl font-bold text-white">📅 월드 보스 시간표</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-zinc-800 text-gray-300">
              <th className="p-2">시간</th>
              {days.map(day => (
                <th key={day} className="p-2">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time} className="border-t border-zinc-700">
                <td className="p-2 text-gray-300">{time}</td>
                {days.map(day => (
                  <td key={day} className="p-2 whitespace-pre-line text-white">
                    {getBosses(day, time)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
