'use client'

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

interface MemberData {
  date: string
  join: number
  leave: number
}

export default function MemberTrendChart({
  data,
  currentMemberCount,
}: {
  data: MemberData[]
  currentMemberCount: number
}) {
  const formatted: (MemberData & { total: number })[] = []

  // 과거부터 누적 계산
  let total = 0
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (i === 0) {
      total = currentMemberCount - data.slice(i + 1).reduce((acc, d) => acc + (d.join || 0) - (d.leave || 0), 0)
    } else {
      total += (item.join || 0) - (item.leave || 0)
    }
    formatted.push({ ...item, total })
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={formatted}
        margin={{ top: 20, right: 20, bottom: 0, left: 0 }}
      >
        <CartesianGrid stroke="#444" strokeDasharray="0" />

        <XAxis
          dataKey="date"
          tick={{ fill: '#ccc' }}
          axisLine={{ stroke: '#666' }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#ccc' }}
          axisLine={{ stroke: '#666' }}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{ backgroundColor: '#111', border: 'none' }}
          labelFormatter={(label) => `날짜: ${label}`}
          formatter={(value, name) => {
            if (name === 'total') return [`${value}명`, '전체 인원']
            if (name === 'join') return [`${value}명`, '가입']
            if (name === 'leave') return [`${value}명`, '탈퇴']
            return [value, name]
          }}
        />
        <Legend />

        <Bar dataKey="join" fill="#10b981" name="가입" barSize={20} />
        <Bar dataKey="leave" fill="#d1d5db" name="탈퇴" barSize={20} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#ffffff"
          strokeWidth={3}
          name="전체 인원"
          dot={{ r: 5, strokeWidth: 2, stroke: '#fff', fill: 'black' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
