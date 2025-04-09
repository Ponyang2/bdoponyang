import { getGuildLeagueTop10 } from '@/lib/queries/guild-league'

export default async function GuildLeagueTop10Server() {
  const guilds = await getGuildLeagueTop10()

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 shadow px-4 py-5 min-w-[340px] w-full">
      <h2 className="text-center text-lg font-semibold mb-4">🏆 길드 리그 TOP 10</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-300 text-center">
            <th className="px-2 py-2 whitespace-nowrap">순위</th>
            <th className="px-2 py-2 whitespace-nowrap">길드명</th>
            <th className="px-2 py-2 whitespace-nowrap">승/패</th>
            <th className="px-2 py-2 whitespace-nowrap">승률</th>
            <th className="px-2 py-2 whitespace-nowrap">점수</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {guilds.map((g, i) => {
            const total = g.wins + g.losses
            const rate = total > 0 ? Math.round((g.wins / total) * 100) : 0

            return (
              <tr key={g.guild_name} className="text-white">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-2 py-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {g.guild_name}
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  {g.wins}승 / {g.losses}패
                </td>
                <td className="px-2 py-1">{rate}%</td>
                <td className="px-2 py-1">{g.score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
