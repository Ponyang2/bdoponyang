'use client'

import SolareAdminForm from '@/components/admin/SolareAdminForm'
import classList from '@/lib/constants/class-list'
import { useEffect, useState } from 'react'

export interface Entry {
  family_name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
}

export default function SolareAdminPage() {
  const [selectedClass, setSelectedClass] = useState('전체')
  const [overall, setOverall] = useState<Entry[]>([])
  const [classData, setClassData] = useState<Record<string, Entry[]>>({})

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/solare/load')
      const data = await res.json()
      setOverall(data.overall)
      setClassData(data.classData)
    }
    fetchData()
  }, [])

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🌞 솔라레 관리자 페이지</h1>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedClass('전체')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${selectedClass === '전체' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
        >
          전체
        </button>
        {classList.map(cls => (
          <button
            key={cls}
            onClick={() => setSelectedClass(cls)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${selectedClass === cls ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {cls}
          </button>
        ))}
      </div>

      <SolareAdminForm
        selectedClass={selectedClass}
        overall={overall}
        classData={classData}
        setOverall={setOverall}
        setClassData={setClassData}
      />
    </div>
  )
}
