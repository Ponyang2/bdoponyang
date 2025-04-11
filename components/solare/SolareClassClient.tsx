// ✅ /components/solare/SolareClassClient.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import classList from '@/lib/constants/class-list'
import { notFound } from 'next/navigation'
import SolareTable from './SolareTable'
import ClassSelector from './ClassSelector'

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

export default function SolareClassClient() {
  const params = useParams()
  const className = decodeURIComponent(params?.class as string || '')
  const [data, setData] = useState<Entry[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!classList.includes(className)) {
      setError(true)
      return
    }

    fetch(`/api/solare-league/${encodeURIComponent(className)}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setData)
      .catch(() => setError(true))
  }, [className])

  if (error) return <div className="p-4 max-w-5xl mx-auto">존재하지 않는 클래스입니다.</div>
  if (!data) return <div className="p-4 max-w-5xl mx-auto">불러오는 중...</div>

  return (
    <div className="p-4 max-w-screen-xl mx-auto mt-4">
      <h1 className="text-2xl text-center font-bold mb-7">🌞 솔라레의 창 - {className} 랭킹 🌞</h1>
      <ClassSelector />
      <SolareTable data={data} />
    </div>
  )
}