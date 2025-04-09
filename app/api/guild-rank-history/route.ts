// ✅ 경로: app/api/guild-rank-history/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db" // 너가 쓰는 PostgreSQL 연결 파일 (확인 필요)

export async function GET(req: NextRequest) {
  const guildName = req.nextUrl.searchParams.get("name")
  if (!guildName) {
    return NextResponse.json({ error: "Missing guild name" }, { status: 400 })
  }

  try {
    const result = await db.query(
      `SELECT snapshot_date, rank 
       FROM guild_league_history 
       WHERE guild_name = $1 
       ORDER BY snapshot_date`,
      [guildName]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("🔥 DB 조회 실패:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
