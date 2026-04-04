// src/app/api/dashboard/stats/route.js
// import { NextResponse } from 'next/server';
// const { getDashboardData } = require('../../../../repositories/dashboard.repo');

// export async function GET() {
//   try {
//     const data = await getDashboardData();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Dashboard API Error:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ดึง URL ของ Backend จาก Render (ที่เราตั้งค่าใน Vercel Environment Variables)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // เรียกไปที่ Endpoint ของ Backend (ต้องมั่นใจว่า Express เปิด Route นี้ไว้)
    const response = await fetch(`${backendUrl}/api/dashboard/stats`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Frontend API Error:', error);
    return NextResponse.json(
      { message: 'Cannot connect to Backend API', error: error.message }, 
      { status: 500 }
    );
  }
}