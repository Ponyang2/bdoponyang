'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { saveAllSolare } from '@/actions/solare-league/save-all'

interface SolareRow {
  rank: number
  character_name: string
  class: string
  win_rate: string
  wins: string
  draws: string
  losses: string
  score: string
}

export default function AdminSolareLeaguePage() {
  const [rows, setRows] = useState<SolareRow[]>(
    Array.from({ length: 100 }, (_, i) => ({
      rank: i + 1,
      character_name: '',
      class: '',
      win_rate: '',
      wins: '',
      draws: '',
      losses: '',
      score: '',
    }))
  )

  const handleChange = (
    index: number,
    key: keyof SolareRow,
    value: string
  ) => {
    const updated = [...rows]
    updated[index] = {
      ...updated[index],
      [key]: value,
    }
    setRows(updated)
  }

  const handleSave = async () => {
    try {
      await saveAllSolare(rows)
      alert('✅ 전체 저장 완료!')
    } catch (err) {
      console.error('❌ 저장 실패:', err)
      alert('❌ 저장 실패')
    }
  }

  const columns: { key: keyof SolareRow; label: string }[] = [
    { key: 'character_name', label: '가문명' },
    { key: 'class', label: '클래스' },
    { key: 'win_rate', label: '승률' },
    { key: 'wins', label: '승' },
    { key: 'draws', label: '무' },
    { key: 'losses', label: '패' },
    { key: 'score', label: '점수' },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">솔라레 랭킹 관리</h1>

      <table className="w-full text-sm text-center text-white border border-gray-700">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="p-2">순위</th>
            {columns.map((col) => (
              <th key={col.key} className="p-2">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="p-1">{row.rank}</td>
              {columns.map((col) => (
                <td key={col.key} className="p-1">
                  <input
                    type="text"
                    value={row[col.key] as string}
                    onChange={(e) => handleChange(index, col.key, e.target.value)}
                    className="bg-gray-900 text-white p-1 w-full border border-gray-600 rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSave}>💾 전체 저장</Button>
      </div>
    </div>
  )
}
