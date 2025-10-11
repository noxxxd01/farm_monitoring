import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log("Fetching half-hour aggregated data...");

    const [rows] = await conn.execute(
      `SELECT
  CONCAT(
    DATE_FORMAT(created_at, '%H'),
    ':',
    LPAD(FLOOR(MINUTE(created_at) / 30) * 30, 2, '0')
  ) AS time_slot,
  ROUND(AVG(temperature), 1) AS temp,
  ROUND(AVG(humidity), 1) AS humid
FROM sensor_data
WHERE created_at >= NOW() - INTERVAL 24 HOUR
GROUP BY time_slot
ORDER BY time_slot ASC;
`
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await conn?.end();
  }
}
