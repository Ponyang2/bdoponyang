// ✅ 경로: components/charts/DoughnutChart.tsx
"use client"

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export function DoughnutChart({ join, leave }: { join: number, leave: number }) {
  const data = {
    labels: ['가입', '탈퇴'],
    datasets: [
      {
        label: '최근 1개월 내역',
        data: [join, leave],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <Doughnut data={data} />
    </div>
  )
}
