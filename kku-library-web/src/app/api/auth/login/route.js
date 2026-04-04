// const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; // Express.js (Frontend)

// export async function POST(request) {
//   const body = await request.json();

//   const resp = await fetch(`${API_BASE_URL}/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body)
//   });

//   const data = await resp.json();
//   return Response.json(data, { status: resp.status });
// }


// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';

// ใช้ชื่อตัวแปรให้ตรงกับที่ตั้งใน Vercel Settings
// และลบ default localhost ออก เพื่อให้มันไปดึงจาก Environment จริงเท่านั้น
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request) {
  try {
    const body = await request.json();

    // ยิงไปที่ Render Backend (ตัวอย่าง: https://kku-api.onrender.com/auth/login)
    const resp = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    
    // ส่งข้อมูลกลับไปที่หน้าบ้าน (Browser)
    return NextResponse.json(data, { status: resp.status });

  } catch (error) {
    console.error('Login Proxy Error:', error);
    return NextResponse.json(
      { message: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลักได้' }, 
      { status: 500 }
    );
  }
}