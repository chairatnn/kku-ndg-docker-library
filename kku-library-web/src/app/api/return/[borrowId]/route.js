// src/app/api/return/[borrowId]/route.js
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const authHeader = request.headers.get('authorization');
    
    // 1. ดึง borrowId ออกมา (Next.js 15 ต้อง await params)
    const resolvedParams = await params;
    const borrowId = resolvedParams.borrowId;

    if (!borrowId) {
      return NextResponse.json({ message: 'ไม่พบรหัสการยืม' }, { status: 400 });
    }

    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is missing");
    }

    // 2. ส่งต่อไปยัง Render (ตรวจสอบ Path /api/returns ให้ตรงกับ app.js)
    // สมมติว่าใน app.js ใช้ app.use('/api/returns', ...)
    const resp = await fetch(`${backendUrl}/api/returns/${borrowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '', 
      },
    });

    const data = await resp.json();
    
    // 3. ส่งผลลัพธ์กลับไปที่ Frontend
    if (!resp.ok) {
      return NextResponse.json(
        { message: data.message || 'คืนหนังสือไม่สำเร็จ' }, 
        { status: resp.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("[Return API Proxy Error]:", error.message);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์หลัก', error: error.message }, 
      { status: 500 }
    );
  }
}