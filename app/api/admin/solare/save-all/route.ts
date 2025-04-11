import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

interface Entry {
  family_name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
}

export async function POST(req: NextRequest) {
  const { overall, classData }: { overall: Entry[]; classData: Record<string, Entry[]> } =
    await req.json()

  const client = await db.connect()

  try {
    // 전체 삭제 후 재삽입
    await client.query('BEGIN')
    await client.query('DELETE FROM solare_overall_league')
    await client.query('DELETE FROM solare_class_league')

    for (const v of overall) {
      await client.query(
        `
        INSERT INTO solare_overall_league (family_name, subclass, class, wins, draws, losses, score)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [v.family_name, v.subclass, v.class, v.wins, v.draws, v.losses, v.score]
      )
    }

    for (const [cls, entries] of Object.entries(classData)) {
      for (const v of entries) {
        await client.query(
          `
          INSERT INTO solare_class_league (family_name, subclass, class, wins, draws, losses, score)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [v.family_name, v.subclass, v.class, v.wins, v.draws, v.losses, v.score]
        )
      }
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ save-all error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
