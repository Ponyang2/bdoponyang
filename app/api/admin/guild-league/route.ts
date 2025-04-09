// app/api/admin/guild-league/route.ts
'use server'
import { NextResponse } from 'next/server'
import { db } from 'lib/db'

export async function GET() {
  const result = await db.query('SELECT * FROM guild_league ORDER BY rank ASC')
  return NextResponse.json(result.rows)
}
