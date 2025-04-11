'use client'

import { getTier } from '@/lib/utils/tier'

export interface Entry {
  family_name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
}

interface Props {
  selectedClass: string
  overall: Entry[]
  classData: Record<string, Entry[]>
  setOverall: (data: Entry[]) => void
  setClassData: (fn: (prev: Record<string, Entry[]>) => Record<string, Entry[]>) => void
}

export default function SolareAdminForm({
  selectedClass,
  overall,
  classData,
  setOverall,
  setClassData
}: Props) {
  const isOverall = selectedClass === '전체'
  const data = isOverall ? overall : (classData[selectedClass] ?? [])

  const ensureEntry = (entry?: Entry): Entry => ({
    family_name: entry?.family_name || '',
    subclass: entry?.subclass || '',
    class: entry?.class || '',
    wins: entry?.wins ?? 0,
    draws: entry?.draws ?? 0,
    losses: entry?.losses ?? 0,
    score: entry?.score ?? 0,
  })

  const handleChange = (index: number, field: keyof Entry, value: string) => {
    const updated = [...data]
    const entry = ensureEntry(updated[index])
    const newEntry: Entry = {
      ...entry,
      [field]: ['wins', 'draws', 'losses', 'score'].includes(field)
        ? parseInt(value) || 0
        : value
    } as Entry
    updated[index] = newEntry

    if (isOverall) {
      setOverall(updated)
    } else {
      setClassData(prev => ({ ...prev, [selectedClass]: updated }))
    }
  }

  const handleSave = async () => {
    const res = await fetch('/api/admin/solare/save-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overall, classData })
    })
    if (res.ok) alert('저장 완료')
    else alert('저장 실패')
  }

  return (
    <div className="space-y-4 text-base">
      <h2 className="text-xl font-semibold">{selectedClass} 랭킹</h2>
      <table className="w-full text-lg border border-gray-700">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border p-2 text-sm">순위</th>
            <th className="border p-2 text-lg">가문명</th>
            <th className="border p-2 text-lg">전승/각성</th>
            <th className="border p-2 text-lg">클래스</th>
            <th className="border p-2 text-lg">승</th>
            <th className="border p-2 text-lg">무</th>
            <th className="border p-2 text-lg">패</th>
            <th className="border p-2 text-lg">점수</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: isOverall ? 100 : 20 }).map((_, i) => {
            const entry = ensureEntry(data[i])
            return (
              <tr key={i}>
                <td className="border p-2 text-center text-sm">{i + 1}</td>
                {(Object.keys(entry) as (keyof Entry)[]).map((key) =>
                  ['wins', 'draws', 'losses', 'score'].includes(key) ? (
                    <td key={key} className="border p-1">
                      <input
                        type="number"
                        className="w-full bg-transparent p-1 text-sm"
                        value={entry[key]}
                        onChange={e => handleChange(i, key, e.target.value)}
                      />
                    </td>
                  ) : (
                    <td key={key} className="border p-1">
                      <input
                        className="w-full bg-transparent p-1 text-sm"
                        value={entry[key] as string}
                        onChange={e => handleChange(i, key, e.target.value)}
                      />
                    </td>
                  )
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded mt-2">
        전체 저장
      </button>
    </div>
  )
}
