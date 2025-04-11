'use client'

import { useEffect, useState } from 'react'
import ClassSelector from '@/components/solare/ClassSelector'
import SolareTable from '@/components/solare/SolareTable'

interface Entry {
  family_name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  tier: string
}

export default function SolareOverallPage() {
  const [data, setData] = useState<Entry[]>([])

  useEffect(() => {
    fetch('/api/solare-league/overall')
      .then(res => res.json())
      .then(setData)
  }, [])

  return (
    <div className="p-4 max-w-screen-xl mx-auto mt-4">
      <h1 className="text-2xl text-center font-bold mb-7">🌞 솔라레의 창 - 정규시즌 전체 랭킹 🌞</h1>
      <ClassSelector />
      <SolareTable data={data} />
    </div>
  )
}
