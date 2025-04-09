// ✅ 경로: lib/queries/world-boss.ts
import { db } from '@/lib/db'

// 전체 요일/시간표 (전체 시간표 열기 용도)
export async function getWorldBossSchedule() {
  const client = await db.connect()

  try {
    const res = await client.query(`
      SELECT day, time::text, bosses
      FROM world_boss_schedule
      ORDER BY time ASC
    `)

    return res.rows.map(row => ({
      ...row,
      time: row.time.slice(0, 5), // "02:00:00" → "02:00"
    }))
  } finally {
    client.release()
  }
}

// ✅ 현재 시간 기준 다음 보스 시간대 1개만
export async function getNextWorldBosses() {
  const client = await db.connect()

  try {
    const now = new Date()
    const dayKor = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()]
    const currentTime = now.toTimeString().slice(0, 5) // "23:12"

    const res = await client.query(
      `
      SELECT time::text, bosses
      FROM world_boss_schedule
      WHERE day = $1 AND time > $2
      ORDER BY time ASC
      LIMIT 1
      `,
      [dayKor, currentTime]
    )

    // 없을 경우(예: 하루 끝나기 직전) → 다음날 첫 보스 반환
    if (res.rows.length === 0) {
      const nextDay = ['일', '월', '화', '수', '목', '금', '토'][(now.getDay() + 1) % 7]
      const fallback = await client.query(
        `
        SELECT time::text, bosses
        FROM world_boss_schedule
        WHERE day = $1
        ORDER BY time ASC
        LIMIT 1
        `,
        [nextDay]
      )
      return fallback.rows
    }

    return res.rows
  } finally {
    client.release()
  }
}
