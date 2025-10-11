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

    // Fetch all data (sorted newest first)
    const [rows] = await conn.execute(
      `SELECT id, temperature, humidity, mq2_value, created_at FROM sensor_data ORDER BY created_at DESC`
    );

    await conn.end();

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
