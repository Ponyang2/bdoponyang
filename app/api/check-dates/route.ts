import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = await db.connect()
  try {
    const result = await client.query(
      `SELECT war_date, a.name as alliance_name, w.occupied_area 
       FROM war_records w 
       LEFT JOIN alliances a ON w.alliance_id = a.id 
       WHERE war_date IN ('2024-05-06', '2024-05-07') 
       ORDER BY war_date;`
    )
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('에러 발생:', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  } finally {
    client.release()
  }
} 