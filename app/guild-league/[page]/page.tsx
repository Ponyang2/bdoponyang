// ✅ 캐시 강제 비활성화 → 항상 최신 서버 데이터를 보여줌
export const dynamic = 'force-dynamic'

import { getAllGuildLeague } from "@/actions/guild-league/get-all"
import { Card } from "@/components/card"
import { Trophy } from "lucide-react"
import Link from "next/link"

interface Guild {
  name: string
  wins: number
  losses: number
  winRate: number
  score: number
  rank: number
  updated_at: Date
  rankChange?: string
  snapshot_date: Date
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
    snapshot_date: guild.snapshot_date,
    rankChange: guild.rank_diff,
  }))

  const guilds = data

  const updatedAt =
    data.length > 0 && data[0].snapshot_date
      ? new Date(new Date(data[0].snapshot_date).getTime() + 9 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      : ""

  const rankStyles = [
    "bg-gradient-to-r from-yellow-500 to-black-700 text-white", // 1위
    "bg-gradient-to-r from-gray-400 to-black-700 text-white",   // 2위
    "bg-gradient-to-r from-amber-700 to-black-700 text-white", // 3위
  ]

  const getRankChangeStyle = (change: string) => {
    if (change.startsWith("▲")) return "text-red-400"
    if (change.startsWith("▼")) return "text-blue-400"
    return "text-gray-300"
  }

  return (
    <Card className="p-6 max-w-screen-xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-6 rounded-2xl shadow-lg flex items-center justify-center mb-2">
        <h2 className="text-4xl text-center font-bold text-white flex items-center gap-2 m-0">
          <Trophy className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          <span>길드 리그 - 정규 시즌 순위</span>
        </h2>
      </div>
      <div className="flex justify-between w-full text-sm text-white mt-2 px-2 mb-4">
        <span>⏰ 매일 오전 중에 업데이트 중입니다.</span>
        <span>📅 {updatedAt}</span>
      </div>

      <table className="w-full text-lg text-center">
        <thead>
          <tr className="border-0 bg-gray-800 border-gray-700 text-white-300">
            <th className="py-3 px-2 text-xl">순위</th>
            <th className="py-3 px-2 text-xl">길드명</th>
            <th className="py-3 px-2 text-xl">승/패</th>
            <th className="py-3 px-2 text-xl">승률</th>
            <th className="py-3 px-2 text-xl">점수</th>
          </tr>
        </thead>
        <tbody>
          {guilds.map((guild) => {
            const rankChange = guild.rankChange || "-"
            const changeColor = getRankChangeStyle(rankChange)

            return (
              <tr
                key={guild.name}
                className={`border-b border-gray-700 text-white ${
                  guild.rank <= 3 ? rankStyles[guild.rank - 1] : ""
                } text-lg`}
              >
                <td className="py-3 px-2 font-semibold flex items-center justify-center gap-1">
                  <span className="w-6 text-right">{guild.rank}</span>
                  <span className={`w-6 text-left text-xs ${changeColor}`}>{rankChange}</span>
                </td>
                <td className="py-3 px-2 font-semibold text-white-300 hover:text-blue-400">
                  <Link href={`/guild/${encodeURIComponent(guild.name)}`}>
                    {guild.name}
                  </Link>
                </td>
                <td className="py-3 px-2 font-normal">
                  {guild.wins}승 / {guild.losses}패
                </td>
                <td className="py-3 px-2 font-semibold">
                  {guild.winRate >= 80 ? (
                    <span className="text-rose-400 font-bold">{guild.winRate}%</span>
                  ) : guild.winRate >= 70 ? (
                    <span className="text-yellow-300 font-semibold">{guild.winRate}%</span>
                  ) : (
                    <span className="text-shadow-black">{guild.winRate}%</span>
                  )}
                </td>
                <td className="py-3 px-2 font-semibold">{guild.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}