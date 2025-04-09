// ✅ 경로: components/home/WorldBossSection.tsx
'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const WorldBossCard = dynamic(() => import('./WorldBossCard'), { ssr: false })
const WorldBossSchedule = dynamic(() => import('./WorldBossSchedule'), { ssr: false })

export default function WorldBossSection() {
  const [showSchedule, setShowSchedule] = useState(false)

  return (
    <>
      <WorldBossCard />
      <div className="text-right mt-2">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="bg-zinc-700 px-4 py-2 rounded text-sm hover:bg-zinc-600"
        >
          {showSchedule ? '닫기' : '전체 시간표 열기'}
        </button>
      </div>
      {showSchedule && <WorldBossSchedule />}
    </>
  )
}
