/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/(^|;\s*)token=([^;]+)/);
    if (!match)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = match[2];
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (!payload?.id)
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });

    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // connect DB
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // check old password
    const [rows] = await conn.execute(
      "SELECT password FROM users WHERE id = ? LIMIT 1",
      [payload.id]
    );
    const user = (rows as any[])[0];
    if (!user) {
      await conn.end();
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      await conn.end();
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 401 }
      );
    }

    // update password
    const hashed = await bcrypt.hash(newPassword, 10);
    await conn.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      payload.id,
    ]);
    await conn.end();

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
