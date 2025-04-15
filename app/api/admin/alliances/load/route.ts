import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT a.name AS name, a.tiers AS tiers, STRING_AGG(ag.guild_name, ',') AS guilds
      FROM alliances a
      LEFT JOIN alliance_guilds ag ON ag.alliance_id = a.id
      GROUP BY a.name, a.tiers
      ORDER BY a.name
    `)

    return NextResponse.json(result.rows.map(row => ({
      name: row.name,
      tiers: row.tiers ?? [], // ✅ 배열로 변환
      guilds: row.guilds
        ? row.guilds.split(',').map((g: string) => g.trim()).filter(Boolean)
        : [],
    })))
  } catch (err) {
    console.error('Error loading alliances:', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  } finally {
    client.release()
  }
}
