'use server'

import { db } from 'lib/db'
import { revalidatePath } from 'next/cache'

export async function saveAllGuildLeague(data: any[], date?: string) {
  const now = new Date()
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const snapshotDate = date || kstNow.toISOString().split('T')[0]
  const todayStr = kstNow.toISOString().split('T')[0]

  if (snapshotDate === todayStr) {
    // 오늘 날짜면 현재 테이블과 히스토리 모두 저장
    await db.query('DELETE FROM guild_league')
    await db.query('DELETE FROM guild_league_history WHERE snapshot_date = $1', [snapshotDate])
    for (const row of data) {
      const rank = parseInt(row.rank) || 0
      const score = parseInt(row.score) || 0
      const wins = parseInt(row.wins) || 0
      const losses = parseInt(row.losses) || 0
      const guild_name = (row.guild_name || '').trim()
      if (!guild_name || rank === 0 || score === 0 || (wins === 0 && losses === 0)) continue
      await db.query(
        `INSERT INTO guild_league (rank, guild_name, wins, losses, score, updated_at)
         VALUES ($1, $2, $3, $4, $5, now())`,
        [rank, guild_name, wins, losses, score]
      )
      await db.query(
        `INSERT INTO guild_league_history (guild_name, rank, wins, losses, score, snapshot_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [guild_name, rank, wins, losses, score, snapshotDate]
      )
    }
  } else {
    // 과거 날짜면 히스토리 테이블에만 저장
    await db.query('DELETE FROM guild_league_history WHERE snapshot_date = $1', [snapshotDate])
    for (const row of data) {
      const rank = parseInt(row.rank) || 0
      const score = parseInt(row.score) || 0
      const wins = parseInt(row.wins) || 0
      const losses = parseInt(row.losses) || 0
      const guild_name = (row.guild_name || '').trim()
      if (!guild_name || rank === 0 || score === 0 || (wins === 0 && losses === 0)) continue
      await db.query(
        `INSERT INTO guild_league_history (guild_name, rank, wins, losses, score, snapshot_date)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [guild_name, rank, wins, losses, score, snapshotDate]
      )
    }
  }

  revalidatePath('/guild-league')
}