import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const temperature = parseFloat(searchParams.get("temperature") || "0");
    const humidity = parseFloat(searchParams.get("humidity") || "0");
    const mq2 = parseInt(searchParams.get("mq2") || "0");

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Insert the current reading
    await conn.execute(
      `INSERT INTO sensor_data (temperature, humidity, mq2_value)
       VALUES (?, ?, ?)`,
      [temperature, humidity, mq2]
    );

    // Calculate averages for last 10 readings
    const [rows] = await conn.execute(
      `SELECT 
        ROUND(AVG(temperature),1) as avg_temp, 
        ROUND(AVG(humidity),1) as avg_humid, 
        ROUND(AVG(mq2_value),0) as avg_mq2 
       FROM (SELECT temperature, humidity, mq2_value 
             FROM sensor_data 
             ORDER BY id DESC 
             LIMIT 10) AS last10`
    );

    const averages =
      Array.isArray(rows) && rows.length > 0
        ? rows[0]
        : { avg_temp: 0, avg_humid: 0, avg_mq2: 0 };

    await conn.end();

    return NextResponse.json({
      success: true,
      averages,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to insert data" },
      { status: 500 }
    );
  }
}
