import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const allianceName = searchParams.get('alliance_name')
  if (!allianceName) return NextResponse.json({ error: 'Missing alliance_name' }, { status: 400 })

  const client = await db.connect()
  try {
    // 현재 연맹의 길드 구성
    const guildRes = await client.query(`
      SELECT ag.guild_name
      FROM alliance_guilds ag
      JOIN alliances a ON ag.alliance_id = a.id
      WHERE a.name = $1
    `, [allianceName])
    const targetGuilds = guildRes.rows.map(r => r.guild_name)
    if (targetGuilds.length === 0) return NextResponse.json([])

    // 전체 연맹의 길드 정보
    const allRes = await client.query(`
      SELECT
        a.id,
        a.name AS alliance_name,
        ARRAY_AGG(ag.guild_name ORDER BY ag.guild_name) AS guilds,
        (
          SELECT COUNT(*) FILTER (WHERE w.result = '점령성공')
          FROM war_records w
          WHERE w.alliance_id = a.id
        ) AS count,
        (
          SELECT COUNT(*)
          FROM war_records w
          WHERE w.alliance_id = a.id
        ) AS participated
      FROM alliances a
      JOIN alliance_guilds ag ON ag.alliance_id = a.id
      GROUP BY a.id
    `)

    // 2개 이상 길드가 겹치는 연맹만 필터링
    const related = allRes.rows
      .filter(row => row.alliance_name !== allianceName)
      .filter(row => {
        const common = row.guilds.filter((g: string) => targetGuilds.includes(g))
        return common.length >= 2 // ✅ 여기서 기준 설정 (2개 이상 겹칠 때)
      })
      .map(row => ({
        alliance_name: row.alliance_name,
        guilds: row.guilds.reverse(), // 보기 편하게 정렬
        count: Number(row.count),
        participated: Number(row.participated)
      }))

    return NextResponse.json(related)
  } catch (err) {
    console.error('[RELATED ALLIANCES ERROR]', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  } finally {
    client.release()
  }
}
