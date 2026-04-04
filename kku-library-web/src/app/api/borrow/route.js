// src/app/api/borrows/route.js
import { NextResponse } from 'next/server';

// ดึง URL ของ Backend (Render) จาก Environment Variable
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request) {
  try {
    // 1. รับ Token จาก Header และข้อมูลการยืมจาก Frontend
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    if (!BACKEND_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    // 2. Forward ต่อไปยัง Render พร้อมแนบ Token และข้อมูลการยืม
    // ตัวอย่าง URL: https://kku-library-api.onrender.com/borrows
    const resp = await fetch(`${BACKEND_URL}/borrows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '', // ส่งต่อ Token (Bearer ...) ไปให้ Render เช็คสิทธิ์
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    // 3. ส่งผลลัพธ์กลับไปที่ Frontend
    if (!resp.ok) {
      return NextResponse.json(
        { message: data.message || 'ไม่สามารถดำเนินการยืมได้' },
        { status: resp.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("[Borrows Proxy Error]:", error.message);
    return NextResponse.json(
      { message: 'ไม่สามารถดำเนินการยืมได้เนื่องจากปัญหาการเชื่อมต่อ', error: error.message },
      { status: 500 }
    );
  }
}