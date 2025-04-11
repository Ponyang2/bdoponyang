import { db } from "@/lib/db"
import { getRankChanges } from "@/lib/guild-league-history"

export async function getGuildLeagueTop10() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT guild_name, wins, losses, score, rank, updated_at
      FROM guild_league
      ORDER BY rank ASC
      LIMIT 10
    `)

    const baseData = result.rows.map((g) => {
      const totalGames = g.wins + g.losses
      const winRate = totalGames > 0 ? (g.wins / totalGames) * 100 : 0

      return {
        name: g.guild_name,
        wins: g.wins,
        losses: g.losses,
        score: g.score,
        rank: g.rank,
        updated_at: g.updated_at,
        winRate, // ✅ 포함!
      }
    })

    const withChange = await getRankChanges(baseData)

    return withChange.map((g) => ({
      guild_name: g.name,
      wins: g.wins,
      losses: g.losses,
      score: g.score,
      rank: g.rank,
      rankChange: g.rankChange, // ✅ 순위 등락
    }))
  } finally {
    client.release()
  }
}
