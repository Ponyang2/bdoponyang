// /app/api/admin/war-records/load/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const region = searchParams.get('region')
  const war_type = searchParams.get('war_type')

  if (!date || !region || !war_type) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 })
  }

  const regionList = region.split(',').map(r => r.trim())

  const client = await db.connect()
  try {
    const result = await client.query(
      `SELECT
         COALESCE(a.name, '[미등록]') AS alliance_name,
         w.occupied_area,
         w.fort_stage,
         w.result
       FROM war_records w
       LEFT JOIN alliances a ON w.alliance_id = a.id
       WHERE w.war_date = $1
         AND w.region = ANY($2)
         AND w.war_type = $3
       ORDER BY w.id ASC`,
      [date, regionList, war_type]
    )

    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('[LOAD WAR RECORDS ERROR]', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  } finally {
    client.release()
  }
}
