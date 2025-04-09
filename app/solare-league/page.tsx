import { db } from "@/lib/db"
import { Card } from "@/components/card"
import { Trophy } from "lucide-react"

interface SolarePlayer {
  rank: number
  character_name: string
  class: string
  win_rate: string
  wins: string
  draws: string
  losses: string
  score: string
}

export default async function SolareLeaguePage() {
  const result = await db.query(`
    SELECT rank, character_name, class, win_rate, wins, draws, losses, score
    FROM solare_league
    ORDER BY rank ASC
  `)

  const data: SolarePlayer[] = result.rows

  return (
    <Card className="p-4 max-w-screen-xl mx-auto mt-6">
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <Trophy className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          <span>솔라레의 창 순위</span>
        </div>
        <div className="flex justify-between w-full text-sm text-gray-400 mt-1 px-1">
          <span>⚔️ 총 100명의 랭킹 정보입니다.</span>
        </div>
      </div>

      <table className="w-full text-sm text-center">
        <thead>
          <tr className="border-b border-gray-700 text-gray-300">
            <th className="p-2">순위</th>
            <th className="p-2">가문명</th>
            <th className="p-2">클래스</th>
            <th className="p-2">승률</th>
            <th className="p-2">승 / 무 / 패</th>
            <th className="p-2">점수</th>
          </tr>
        </thead>
        <tbody>
          {data.map((player) => (
            <tr key={player.rank} className="border-b border-gray-700 text-white">
              <td className="p-2 font-semibold">{player.rank}</td>
              <td className="p-2 font-semibold">{player.character_name}</td>
              <td className="p-2">{player.class}</td>
              <td className="p-2 text-cyan-300 font-semibold">
                {Number(player.win_rate).toFixed(1)}%
              </td>
              <td className="p-2">
                {player.wins} / {player.draws} / {player.losses}
              </td>
              <td className="p-2">{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
