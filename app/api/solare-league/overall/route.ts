// ✅ /app/api/solare-league/overall/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT
        family_name,
        subclass,
        class,
        wins,
        draws,
        losses,
        score,
        tier
      FROM solare_overall_league
      ORDER BY score DESC
      LIMIT 100
    `)
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('[solare_overall_league GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
