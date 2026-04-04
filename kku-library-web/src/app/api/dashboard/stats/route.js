// src/app/api/dashboard/stats/route.js
import { NextResponse } from 'next/server';

export async function GET(request) { // เพิ่ม parameter 'request' เพื่อดึง header
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // 1. ดึง Token จากหน้าบ้านมาด้วย (เผื่อ Backend เช็คสิทธิ์ Admin)
    const authHeader = request.headers.get('authorization');

    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is missing");
    }

    // 2. เรียกไปที่ Render (มั่นใจว่าใน app.js มี app.use('/api/dashboard', ...))
    const response = await fetch(`${backendUrl}/api/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // --- ส่ง Token ต่อไปให้ Backend ---
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Backend error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Dashboard Stats Proxy Error:', error);
    return NextResponse.json(
      { message: 'ไม่สามารถดึงข้อมูลสถิติได้', error: error.message }, 
      { status: 500 }
    );
  }
}