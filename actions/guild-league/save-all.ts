'use server'

import { db } from 'lib/db'
import { revalidatePath } from 'next/cache'

export async function saveAllGuildLeague(data: any[]) {
  const now = new Date()
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const snapshotDate = kstNow.toISOString().split('T')[0]

  await db.query('DELETE FROM guild_league')

  for (const row of data) {
    const rank = parseInt(row.rank) || 0
    const score = parseInt(row.score) || 0
    const wins = parseInt(row.wins) || 0
    const losses = parseInt(row.losses) || 0
    const guild_name = (row.guild_name || '').trim()

    // 필수값 검증 (하나라도 없으면 패스)
    if (!guild_name || rank === 0 || score === 0 || (wins === 0 && losses === 0)) continue

    await db.query(
      `INSERT INTO guild_league (rank, guild_name, wins, losses, score, updated_at)
       VALUES ($1, $2, $3, $4, $5, now())`,
      [rank, guild_name, wins, losses, score]
    )

    await db.query(
      `INSERT INTO guild_league_history (guild_name, rank, snapshot_date)
       VALUES ($1, $2, $3)`,
      [guild_name, rank, snapshotDate]
    )
  }

  revalidatePath('/guild-league')
}