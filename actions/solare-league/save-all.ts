'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

interface SolareRow {
  rank: number
  character_name: string
  class: string
  win_rate: string
  wins: string
  draws: string
  losses: string
  score: string
}

export async function saveAllSolare(data: SolareRow[]) {
  const now = new Date()
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const snapshotDate = kstNow.toISOString().split('T')[0]

  await db.query('DELETE FROM solare_league')

  for (const row of data) {
    const rank = row.rank
    const name = row.character_name.trim()
    const charClass = row.class.trim()
    const winRate = row.win_rate.trim()
    const wins = parseInt(row.wins)
    const draws = parseInt(row.draws)
    const losses = parseInt(row.losses)
    const score = parseInt(row.score)

    if (!name || !charClass || !winRate || isNaN(score)) continue

    await db.query(
      `INSERT INTO solare_league
       (rank, character_name, class, win_rate, wins, draws, losses, score, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())`,
      [rank, name, charClass, winRate, wins, draws, losses, score]
    )

    await db.query(
      `INSERT INTO solare_league_history (character_name, rank, snapshot_date)
       VALUES ($1, $2, $3)`,
      [name, rank, snapshotDate]
    )
  }

  revalidatePath('/solare-league')
}
