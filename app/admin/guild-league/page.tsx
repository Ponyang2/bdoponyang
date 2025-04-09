'use client'

import { useEffect, useState } from 'react'
import SaveAllButton from './save-all-button'

interface GuildRow {
  id: number
  rank: number
  guild_name: string
  wins: number
  losses: number
  score: number
}

export default function AdminGuildLeaguePage() {
  const [rows, setRows] = useState<GuildRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/guild-league')
      const data = await res.json()

      if (data.length < 100) {
        const emptyRows = Array.from({ length: 100 - data.length }, (_, i) => ({
          id: data.length + i + 1,
          rank: data.length + i + 1,
          guild_name: '',
          wins: 0,
          losses: 0,
          score: 0,
        }))
        setRows([...data, ...emptyRows])
      } else {
        setRows(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const updateRow = (index: number, key: keyof GuildRow, value: string) => {
    setRows((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [key]: ['rank', 'wins', 'losses', 'score'].includes(key) ? Number(value) : value,
      }
      return updated
    })
  }

  if (loading) return <p className="text-center mt-10 text-zinc-400">불러오는 중...</p>

  return (
    <div className="max-w-screen-lg mx-auto py-10 px-4"> {/* 여백추가 */}
      <h1 className="text-2xl font-bold mb-6">🛠️ 길드 리그 전체 수정</h1>
      <table className="w-full text-sm border border-zinc-700">
        <thead className="bg-zinc-800 text-gray-300">
          <tr>
            <th className="p-2">순위</th>
            <th className="p-2">길드명</th>
            <th className="p-2">승</th>
            <th className="p-2">패</th>
            <th className="p-2">점수</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-zinc-700">
              <td className="p-2">
                <input type="number" value={row.rank} onChange={(e) => updateRow(i, 'rank', e.target.value)} className="w-full bg-transparent border px-2 py-1 text-white" />
              </td>
              <td className="p-2">
                <input value={row.guild_name} onChange={(e) => updateRow(i, 'guild_name', e.target.value)} className="w-full bg-transparent border px-2 py-1 text-white" />
              </td>
              <td className="p-2">
                <input type="number" value={row.wins} onChange={(e) => updateRow(i, 'wins', e.target.value)} className="w-full bg-transparent border px-2 py-1 text-white" />
              </td>
              <td className="p-2">
                <input type="number" value={row.losses} onChange={(e) => updateRow(i, 'losses', e.target.value)} className="w-full bg-transparent border px-2 py-1 text-white" />
              </td>
              <td className="p-2">
                <input type="number" value={row.score} onChange={(e) => updateRow(i, 'score', e.target.value)} className="w-full bg-transparent border px-2 py-1 text-white" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <SaveAllButton data={rows} />
    </div>
  )
}
