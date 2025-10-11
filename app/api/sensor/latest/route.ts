/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Updated query – only the existing columns
    const [rows] = await conn.execute(
      "SELECT id, temperature, humidity, mq2_value, created_at FROM sensor_data ORDER BY created_at DESC LIMIT 1"
    );
    await conn.end();

    if ((rows as any[]).length === 0)
      return NextResponse.json({ error: "No data found" }, { status: 404 });

    return NextResponse.json((rows as any[])[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
