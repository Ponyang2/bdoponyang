import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const regionParam = searchParams.get('region')
  const war_type = searchParams.get('war_type')

  if (!date || !regionParam || !war_type) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const regions = regionParam.split(',')

  const client = await db.connect()
  try {
    const result = await client.query(
      `
      SELECT
        w.id,
        w.war_type,
        w.war_date,
        a.name AS alliance_name,  -- ✅ 연맹 이름
        w.occupied_area,
        w.result,
        w.fort_stage,
        w.region
      FROM war_records w
      LEFT JOIN alliances a ON w.alliance_id = a.id
      WHERE w.war_date = $1 AND w.war_type = $2 AND w.region = ANY($3)
      ORDER BY w.region ASC, a.name ASC
      `,
      [date, war_type, regions]
    )

    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('DB Error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    client.release()
  }
}
