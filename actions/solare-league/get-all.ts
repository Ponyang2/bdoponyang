// ✅ 경로: actions/solare-league/get-all.ts
'use server'

import { db } from '@/lib/db'

export async function getAllSolareLeague() {
  const result = await db.query(`
    SELECT * FROM solare_league
    ORDER BY rank ASC
  `)
  return result.rows
}
