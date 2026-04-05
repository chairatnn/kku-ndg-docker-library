// src/app/api/borrows/route.js
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    if (!BACKEND_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined in Vercel settings");
    }

    // --- แก้ไข Path ให้ตรงกับ Backend (เติม /api เข้าไป) ---
    const targetUrl = `${BACKEND_URL}/api/borrows`;

    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ส่งต่อ Token เพื่อให้ Backend (Render) ตรวจสอบว่าใครเป็นคนยืม
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json().catch(() => ({}));

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