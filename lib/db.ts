import { Pool } from 'pg'

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // 최대 동시 연결 수
  idleTimeoutMillis: 10000, // 10초 유휴 시 커넥션 정리
  connectionTimeoutMillis: 5000, // 연결 대기 시간 제한
})

// 인덱스 생성 함수
export async function createIndexes() {
  const client = await db.connect()
  try {
    // war_records 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_war_records_date_type ON war_records(war_date, war_type);
      CREATE INDEX IF NOT EXISTS idx_war_records_alliance ON war_records(alliance_id);
      CREATE INDEX IF NOT EXISTS idx_war_records_region ON war_records(region);
    `)

    // alliances 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_alliances_name ON alliances(name);
    `)

    // guild_league 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_guild_league_rank ON guild_league(rank);
      CREATE INDEX IF NOT EXISTS idx_guild_league_name ON guild_league(guild_name);
    `)

    // solare 테이블 인덱스
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_solare_class_league_class ON solare_class_league(class);
      CREATE INDEX IF NOT EXISTS idx_solare_overall_league_score ON solare_overall_league(score);
    `)
  } catch (err) {
    console.error('인덱스 생성 중 오류 발생:', err)
  } finally {
    client.release()
  }
}
