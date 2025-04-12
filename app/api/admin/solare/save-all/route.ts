import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

interface Entry {
  name: string
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
    await client.query('BEGIN')
    await client.query('DELETE FROM solare_overall_league')
    await client.query('DELETE FROM solare_class_league')

    // 전체 랭킹
    for (let i = 0; i < overall.length; i++) {
      const entry = overall[i]
      await client.query(
        `
        INSERT INTO solare_overall_league (name, subclass, class, wins, draws, losses, score)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [entry.name, entry.subclass, entry.class, entry.wins, entry.draws, entry.losses, entry.score]
      )

      // ✅ 전체 랭킹 히스토리
      await client.query(
        `
        INSERT INTO solare_overall_league_history (snapshot_date, name, class, classtype, wins, draws, lose, score, class_rank)
        VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [entry.name, entry.class, entry.subclass, entry.wins, entry.draws, entry.losses, entry.score, i + 1]
      )
    }

    // 클래스별 랭킹
    for (const [cls, entries] of Object.entries(classData)) {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        await client.query(
          `
          INSERT INTO solare_class_league (name, subclass, class, wins, draws, losses, score)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [entry.name, entry.subclass, entry.class, entry.wins, entry.draws, entry.losses, entry.score]
        )

        // ✅ 클래스별 랭킹 히스토리
        await client.query(
          `
          INSERT INTO solare_class_league_history (snapshot_date, name, class, classtype, wins, draws, lose, score, class_rank)
          VALUES (CURRENT_DATE, $1, $2, $3, $4, $5, $6, $7, $8)
        `,
          [entry.name, entry.class, entry.subclass, entry.wins, entry.draws, entry.losses, entry.score, i + 1]
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
