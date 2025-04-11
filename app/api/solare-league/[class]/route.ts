import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // 🔥 절대 빼지 마!

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const classNameEncoded = url.pathname.split('/').pop()
  const className = decodeURIComponent(classNameEncoded || '')

  const client = await db.connect()
  try {
    const result = await client.query(
      `
      SELECT
        family_name,
        subclass,
        class,
        wins,
        draws,
        losses,
        score,
        tier
      FROM solare_class_league
      WHERE class = $1
      ORDER BY score DESC
      LIMIT 20
      `,
      [className]
    )
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('[solare_class_league GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}
