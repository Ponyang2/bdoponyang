import { Pool } from 'pg'

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // 최대 동시 연결 수
  idleTimeoutMillis: 10000, // 10초 유휴 시 커넥션 정리
  connectionTimeoutMillis: 5000, // 연결 대기 시간 제한
})
