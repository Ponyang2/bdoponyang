'use client'

import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

export default function RankTrendChart({ guildName }: { guildName: string }) {
  const [data, setData] = useState<{ date: string; rank: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/guild-rank-history?name=${encodeURIComponent(guildName)}`)
        const json = await res.json()

        const formatted = json.map((item: any) => {
          const utcDate = new Date(item.snapshot_date)
          const kst = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000)
          const mm = String(kst.getMonth() + 1).padStart(2, '0')
          const dd = String(kst.getDate()).padStart(2, '0')

          return {
            date: `${mm}-${dd}`, // KST 기준 MM-DD
            rank: Number(item.rank),
          }
        })

        setData(formatted)
      } catch (err) {
        console.error("🔥 길드리그 히스토리 오류:", err)
      }
    }

    fetchData()
  }, [guildName])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#444" strokeDasharray="0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis
          type="number"
          domain={[100, 1]}
          ticks={[1, 20, 40, 60, 80, 100]}
          allowDecimals={false}
          reversed
          tick={{ fill: '#fff', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: 'black', border: 'none' }}
          labelStyle={{ color: '#fff' }}
          formatter={(value) => `${value}`}
        />
        <Line
          type="monotone"
          dataKey="rank"
          stroke="#fff"
          strokeWidth={2}
          dot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: 'black' }}
          activeDot={{ r: 7 }}
          name="길드리그 순위"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
