const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkDates() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT war_date, a.name as alliance_name, w.occupied_area 
       FROM war_records w 
       LEFT JOIN alliances a ON w.alliance_id = a.id 
       WHERE war_date IN ('2024-05-06', '2024-05-07') 
       ORDER BY war_date;`
    );
    console.log('조회된 데이터:', result.rows);
  } catch (err) {
    console.error('에러 발생:', err);
  } finally {
    client.release();
    pool.end();
  }
}

checkDates(); 