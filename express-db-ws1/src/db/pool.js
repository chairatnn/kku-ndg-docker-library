const { Pool } = require('pg');
const env = require('../config/env');

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  // --- เพิ่มส่วนนี้เพื่อให้เชื่อมต่อ Render/Cloud DB ได้ ---
  ssl: {
    rejectUnauthorized: false, // จำเป็นสำหรับ Self-signed certificate บน Render/Supabase
  },
});

// เพิ่มการเช็ค Error เบื้องต้น
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;