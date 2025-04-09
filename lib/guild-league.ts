// lib/guild-league.ts
import { db } from './db'

export async function getGuildLeagueWithPagination(offset: number, limit: number) {
  const res = await db.query(
    'SELECT * FROM guild_league ORDER BY rank ASC LIMIT $1 OFFSET $2',
    [limit, offset]
  )
  return res.rows
}
