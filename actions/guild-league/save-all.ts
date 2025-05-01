'use server'

import { db } from 'lib/db'
import { revalidatePath } from 'next/cache'

export async function saveAllGuildLeague(data: any[], date?: string) {
  // 선택한 날짜를 그대로 사용
  const snapshotDate = date || new Date().toISOString().split('T')[0]
  console.log('저장할 날짜:', snapshotDate)
  console.log('저장할 데이터 개수:', data.length)

  // 현재 테이블과 히스토리 모두 저장
  await db.query('DELETE FROM guild_league')
  await db.query('DELETE FROM guild_league_history WHERE snapshot_date = $1', [snapshotDate])
  
  for (const row of data) {
    const rank = parseInt(row.rank) || 0
    const score = parseInt(row.score) || 0
    const wins = parseInt(row.wins) || 0
    const losses = parseInt(row.losses) || 0
    const guild_name = (row.guild_name || '').trim()
    if (!guild_name || rank === 0 || score === 0 || (wins === 0 && losses === 0)) continue
    
    // 현재 테이블에 저장
    await db.query(
      `INSERT INTO guild_league (rank, guild_name, wins, losses, score, updated_at)
       VALUES ($1, $2, $3, $4, $5, now())`,
      [rank, guild_name, wins, losses, score]
    )
    
    // 히스토리 테이블에도 저장
    await db.query(
      `INSERT INTO guild_league_history (guild_name, rank, wins, losses, score, snapshot_date)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [guild_name, rank, wins, losses, score, snapshotDate]
    )
  }

  // 저장 후 데이터 확인
  const savedData = await db.query(
    `SELECT COUNT(*) as count FROM guild_league_history WHERE snapshot_date = $1`,
    [snapshotDate]
  )
  console.log('저장된 데이터 개수:', savedData.rows[0].count)

  revalidatePath('/guild-league')
}