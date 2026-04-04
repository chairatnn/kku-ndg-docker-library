// src/app/api/books/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const authHeader = request.headers.get('Authorization');

    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is missing in Vercel settings");
    }

    // 1. แก้ไข Path ให้ตรงกับ Backend (ต้องมี /api/books)
    const targetUrl = new URL(`${backendUrl}/api/books`);
    if (search) {
      targetUrl.searchParams.set('search', search);
    }

    // 2. ส่ง Request ต่อไปยัง Render (ให้ Backend เป็นคนจัดการเรื่อง JWT เอง)
    const resp = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      cache: 'no-store',
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Backend error' },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Books Proxy Error]:", error.message);
    return NextResponse.json(
      { message: 'ไม่สามารถดึงข้อมูลหนังสือได้', error: error.message },
      { status: 500 }
    );
  }
}