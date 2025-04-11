import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = await db.connect()
  try {
    const overallRes = await client.query(`
      SELECT * FROM solare_overall_league
      ORDER BY score DESC
      LIMIT 100
    `)

    const classRes = await client.query(`
      SELECT * FROM solare_class_league
      ORDER BY class ASC, score DESC
    `)

    const classData: Record<string, any[]> = {}
    for (const row of classRes.rows) {
      const cls = row.class
      if (!classData[cls]) classData[cls] = []
      classData[cls].push(row)
    }

    return NextResponse.json({
      overall: overallRes.rows,
      classData,
    })
  } catch (err) {
    console.error('🚨 solare load 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}
