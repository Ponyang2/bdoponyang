// ✅ 경로: lib/queries/guild-league.ts
import { db } from '@/lib/db'

export async function getGuildLeagueTop10() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT guild_name, wins, losses, score
      FROM guild_league
      ORDER BY rank ASC
      LIMIT 10
    `)
    return result.rows
  } finally {
    client.release() // ✅ 커넥션 반환!
  }
}
