// ✅ 캐시 강제 비활성화 → 항상 최신 서버 데이터를 보여줌
export const dynamic = 'force-dynamic'

import { getAllGuildLeague } from "@/actions/guild-league/get-all"
import { getRankChanges } from "lib/guild-league-history"
import { Card } from "@/components/card"
import { Trophy } from "lucide-react"

interface Guild {
  name: string
  wins: number
  losses: number
  winRate: number
  score: number
  rank: number
  updated_at: Date
  rankChange?: string
}

export default async function GuildLeaguePage() {
  const rawData = await getAllGuildLeague()

  const data: Guild[] = rawData.map((guild: any) => ({
    name: guild.guild_name,
    wins: guild.wins,
    losses: guild.losses,
    winRate:
      guild.wins + guild.losses > 0
        ? Number(((guild.wins / (guild.wins + guild.losses)) * 100).toFixed(1))
        : 0,
    score: guild.score,
    rank: guild.rank,
    updated_at: guild.updated_at,
  }))

  const guilds = await getRankChanges(data)

  const updatedAt =
    data.length > 0 ? new Date(data[0].updated_at).toISOString().split("T")[0] : ""

  const rankStyles = [
    "bg-gradient-to-r from-amber-500 to-yellow-700 text-white", // 1위
    "bg-gradient-to-r from-gray-400 to-gray-500 text-white",   // 2위
    "bg-gradient-to-r from-amber-700 to-amber-900 text-white", // 3위
  ]

  // 🔻 변동에 따른 색상
  const getRankChangeStyle = (change: string) => {
    if (change.startsWith("▲")) return "text-red-400"
    if (change.startsWith("▼")) return "text-blue-400"
    return "text-gray-300"
  }

  return (
    <Card className="p-4 max-w-screen-xl mx-auto mt-6">
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <Trophy className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          <span>길드 리그 순위</span>
        </div>
        <div className="flex justify-between w-full text-sm text-gray-400 mt-1 px-1">
          <span>⏰ 매일 오전 중에 업데이트 중입니다.</span>
          <span>📅 2025-04-10</span>
        </div>
      </div>

      <table className="w-full text-sm text-center">
        <thead>
          <tr className="border-b border-gray-700 text-gray-300">
            <th className="p-2">순위</th>
            <th className="p-2">길드명</th>
            <th className="p-2">승/패</th>
            <th className="p-2">승률</th>
            <th className="p-2">점수</th>
          </tr>
        </thead>
        <tbody>
          {guilds.map((guild) => {
            const rankChange = guild.rankChange || "-"
            const changeColor = getRankChangeStyle(rankChange)

            return (
              <tr
                key={guild.name}
                className={`border-b border-gray-700 ${
                  guild.rank <= 3 ? rankStyles[guild.rank - 1] : "text-white"
                }`}
              >
                <td className="p-2 font-semibold flex items-center justify-center gap-1">
                  <span className="w-6 text-right">{guild.rank}</span>
                  <span className={`w-6 text-left text-xs ${changeColor}`}>
                    {rankChange}
                  </span>
                </td>
                <td className="p-2 font-semibold">{guild.name}</td>
                <td className="p-2">
                  {guild.wins}승 / {guild.losses}패
                </td>
                <td className="p-2 font-semibold">
                  {guild.winRate >= 80 ? (
                    <span className="text-rose-400 font-bold">{guild.winRate}%</span>
                  ) : guild.winRate >= 70 ? (
                    <span className="text-cyan-300 font-semibold">{guild.winRate}%</span>
                  ) : guild.winRate < 30 ? (
                    <span className="text-blue-400">{guild.winRate}%</span>
                  ) : (
                    <span className="text-gray-300">{guild.winRate}%</span>
                  )}
                </td>
                <td className="p-2">{guild.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}
