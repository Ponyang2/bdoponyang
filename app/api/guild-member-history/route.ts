// ✅ 경로: app/api/guild-member-history/route.ts
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const guildName = req.nextUrl.searchParams.get("name")
  if (!guildName) return NextResponse.json({ error: "길드명이 누락됨" }, { status: 400 })

  const client = await db.connect()

  try {
    const result = await client.query(`
      SELECT
        to_char(DATE_TRUNC('week', change_date + interval '1 day') + interval '6 days', 'MM.DD') AS week_end,
        status,
        COUNT(*) AS count
      FROM guild_history gh
      JOIN guilds g ON gh.guild_id = g.id
      WHERE g.name = $1 AND change_date >= NOW() - INTERVAL '1 month'
      GROUP BY week_end, status
      ORDER BY week_end ASC
    `, [guildName])

    const grouped: Record<string, { date: string, join: number, leave: number }> = {}
    for (const row of result.rows) {
      const date = row.week_end
      if (!grouped[date]) grouped[date] = { date, join: 0, leave: 0 }
      if (row.status === '가입') grouped[date].join = Number(row.count)
      else if (row.status === '탈퇴') grouped[date].leave = Number(row.count)
    }

    return NextResponse.json(Object.values(grouped))
  } catch (e) {
    console.error("🔥 멤버 히스토리 에러:", e)
    return NextResponse.json({ error: "DB 조회 실패" }, { status: 500 })
  } finally {
    client.release()
  }
}
