// src/app/api/users/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // เปลี่ยนมาใช้ชื่อที่ตั้งไว้ใน Vercel Settings
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      console.error("Missing NEXT_PUBLIC_API_URL");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    // ยิงไปที่ Render (https://kku-library-api.onrender.com/users)
    const resp = await fetch(`${backendUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });

  } catch (error) {
    console.error("Create User Proxy Error:", error);
    return NextResponse.json(
      { message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้", error: error.message },
      { status: 500 }
    );
  }
}