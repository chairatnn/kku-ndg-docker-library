// src/app/api/return/[borrowId]/route.js
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const authHeader = request.headers.get('authorization');
    
    // ถูกต้อง: Next.js 15 ต้อง await params
    const { borrowId } = await params;

    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is missing in Vercel settings");
    }

    // --- ตรวจสอบ Path นี้กับ src/app.js ใน Backend อีกครั้ง ---
    const targetUrl = `${backendUrl}/api/returns/${borrowId}`;

    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '', // Forward Token เพื่อเช็คสิทธิ์ Librarian
      },
      // การคืนหนังสือส่วนใหญ่ไม่ต้องการ Body เพราะใช้ ID จาก URL
    });

    const data = await resp.json().catch(() => ({}));
    
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
      { message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์เพื่อคืนหนังสือได้', error: error.message }, 
      { status: 500 }
    );
  }
}