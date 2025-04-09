// ✅ 경로: components/charts/LineChart.tsx
"use client"

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

interface HistoryItem {
  date: string
  join: number
  leave: number
}

export function LineChart({ data }: { data: HistoryItem[] }) {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: '가입',
        data: data.map((item) => item.join),
        borderColor: '#4ade80',
        backgroundColor: '#4ade80',
        tension: 0.2,
      },
      {
        label: '탈퇴',
        data: data.map((item) => item.leave),
        borderColor: '#f87171',
        backgroundColor: '#f87171',
        tension: 0.2,
      },
    ],
  }

  return (
    <div className="w-full">
      <Line data={chartData} />
    </div>
  )
}
