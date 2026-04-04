// src/app/api/books/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  // 1. ดึงค่าจาก Environment Variables ที่ตั้งไว้ใน Vercel Settings
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const jwtSecret = process.env.JWT_SECRET;

  // 2. ดึง Token จาก Header เพื่อระบุตัวตน User (ถ้ามี)
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  let userId = null;

  if (token && jwtSecret) {
    try {
      // ตรวจสอบความถูกต้องของ Token
      const decoded = jwt.verify(token, jwtSecret);
      userId = decoded.sub;
    } catch (e) {
      console.error('[Books Proxy] JWT Verification failed:', e.message);
      // หาก Token ผิดพลาด ให้ปล่อย userId เป็น null เพื่อดึงข้อมูลสาธารณะ
    }
  }

  try {
    // ตรวจสอบว่ามี URL ของ Backend หรือยัง
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined in Vercel");
    }

    // 3. สร้าง URL สำหรับยิงไปที่ Render
    const targetUrl = new URL(`${backendUrl}/books`);
    targetUrl.searchParams.set('search', search);
    
    if (userId) {
      targetUrl.searchParams.set('userId', userId.toString());
    }

    // 4. ส่ง Request ต่อไปยัง Render
    const resp = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '', // ส่ง Token ต่อไปให้ Backend ตรวจสอบสิทธิ์ (ถ้ามี)
      },
      cache: 'no-store', // ป้องกันการจำค่าเก่าเพื่อให้ข้อมูลสดใหม่เสมอ
    });

    // ตรวจสอบสถานะการตอบกลับจาก Render
    if (!resp.ok) {
      const errorText = await resp.text();
      return NextResponse.json(
        { message: 'Backend error', detail: errorText },
        { status: resp.status }
      );
    }

    const data = await resp.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("[Books Proxy] Fetch Error:", error.message);
    return NextResponse.json(
      { message: 'การเชื่อมต่อล้มเหลว', error: error.message },
      { status: 500 }
    );
  }
}