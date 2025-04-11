import Link from "next/link"
import { getGuildLeagueTop10 } from '@/lib/queries/guild-league'

export default async function GuildLeagueTop10Server() {
  const guilds = await getGuildLeagueTop10()

  const getRankChangeStyle = (change: string) => {
    if (change.startsWith("▲")) return "text-red-400"
    if (change.startsWith("▼")) return "text-blue-400"
    return "text-gray-400"
  }

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 shadow px-4 py-5 w-full max-w-[540px]">
      <h2 className="text-center text-lg font-semibold mb-4">🏆 길드 리그 TOP 10</h2>

      <table className="w-full text-sm table-auto">
        <thead>
          <tr className="text-gray-300 text-center">
            <th className="px-2 py-2">순위</th>
            <th className="px-2 py-2">길드명</th>
            <th className="px-2 py-2">승/패</th>
            <th className="px-2 py-2">승률</th>
            <th className="px-2 py-2">점수</th>
          </tr>
        </thead>
        <tbody className="text-center text-white">
          {guilds.map((g, i) => {
            const total = g.wins + g.losses
            const rate = total > 0 ? Math.round((g.wins / total) * 100) : 0
            const rankChange = g.rankChange ?? "-"
            const changeColor = getRankChangeStyle(rankChange)

            return (
              <tr key={g.guild_name} className="h-[42px]">
                <td className="px-2 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-6 text-right">{i + 1}</span>
                    <span className={`w-6 text-left text-xs ${changeColor}`}>{rankChange}</span>
                  </div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-white-300 hover:text-blue-400">
                  <Link href={`/guild/${encodeURIComponent(g.guild_name)}`}>
                    {g.guild_name}
                  </Link>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  {g.wins}승 / {g.losses}패
                </td>
                <td className="px-2 py-1 whitespace-nowrap">{rate}%</td>
                <td className="px-2 py-1 whitespace-nowrap">{g.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
