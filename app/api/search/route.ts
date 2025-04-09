// 경로: app/api/search/route.ts
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim().normalize('NFC')

  if (!q) return NextResponse.json([])

  const client = await db.connect()

  try {
    // 정확히 일치하는 우선 검색
    const exactGuilds = await client.query(
      `SELECT name FROM guilds WHERE name = $1`,
      [q]
    )

    const exactFamilies = await client.query(
      `SELECT family_name FROM family_tracking WHERE family_name = $1`,
      [q]
    )

    // 포함 검색 (한글 정규화 고려)
    const partialGuilds = await client.query(
      `SELECT name FROM guilds WHERE name ILIKE $1`,
      [`%${q}%`]
    )

    const partialFamilies = await client.query(
      `SELECT family_name FROM family_tracking WHERE family_name ILIKE $1`,
      [`%${q}%`]
    )

    const guildMap = new Map<string, { type: 'guild'; name: string }>()
    const famMap = new Map<string, { type: 'family'; name: string }>()

    exactGuilds.rows.forEach(row =>
      guildMap.set(row.name, { type: 'guild', name: row.name })
    )
    partialGuilds.rows.forEach(row =>
      guildMap.set(row.name, { type: 'guild', name: row.name })
    )

    exactFamilies.rows.forEach(row =>
      famMap.set(row.family_name, { type: 'family', name: row.family_name })
    )
    partialFamilies.rows.forEach(row =>
      famMap.set(row.family_name, { type: 'family', name: row.family_name })
    )

    const combined = [...guildMap.values(), ...famMap.values()].slice(0, 5)
    return NextResponse.json(combined)
  } catch (err) {
    console.error('Search API Error:', err)
    return NextResponse.json([], { status: 500 })
  } finally {
    client.release()
  }
}
