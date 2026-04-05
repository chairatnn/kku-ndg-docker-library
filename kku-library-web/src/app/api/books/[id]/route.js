import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// --- 1. GET: ดึงข้อมูลหนังสือรายเล่ม ---
export async function GET(req, { params }) {
  // 1. Next.js 15 ต้อง await params
  const { id } = await params;

  try {
    if (!BACKEND_URL)
      throw new Error("NEXT_PUBLIC_API_URL is missing in Vercel");

    // 🚩 ดึง Token จาก Header ที่หน้าบ้านส่งมา
    const authHeader = req.headers.get("authorization");

    // 2. เติม /api ให้ตรงกับ Backend (https://...render.com/api/books/1)
    const targetUrl = `${BACKEND_URL}/api/books/${id}`;

    const resp = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        // 🚩 ส่งต่อ Token ไปให้ Render Backend
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return NextResponse.json(
        { message: json.message || "ไม่พบข้อมูลหนังสือ" },
        { status: resp.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("[Get Book ID Proxy Error]:", error.message);
    return NextResponse.json(
      { message: "เชื่อมต่อ Backend ไม่สำเร็จ", error: error.message },
      { status: 500 },
    );
  }
}

// --- 2. PUT: อัปเดตข้อมูลหนังสือ ---
export async function PUT(req, { params }) {
  const { id } = await params;

  try {
    if (!BACKEND_URL) throw new Error("NEXT_PUBLIC_API_URL is missing");

    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    // 3. เติม /api ให้ตรงกับ Backend
    const targetUrl = `${BACKEND_URL}/api/books/${id}`;

    const resp = await fetch(targetUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // ส่งต่อ Token เพื่อให้ Backend เช็คว่าเป็น Admin จริงไหม
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return NextResponse.json(
        { message: json.message || "แก้ไขข้อมูลไม่สำเร็จ" },
        { status: resp.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("[Update Book Proxy Error]:", error.message);
    return NextResponse.json(
      {
        message: "เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// --- 3. DELETE: ลบข้อมูลหนังสือ ---
export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const authHeader = req.headers.get("authorization");

    const targetUrl = `${BACKEND_URL}/api/books/${id}`;

    const resp = await fetch(targetUrl, {
      method: "DELETE",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return NextResponse.json(
        { message: json.message || "ลบข้อมูลไม่สำเร็จ" },
        { status: resp.status },
      );
    }

    return NextResponse.json({ message: "ลบข้อมูลเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("[Delete Book Proxy Error]:", error.message);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการลบข้อมูล", error: error.message },
      { status: 500 },
    );
  }
}
