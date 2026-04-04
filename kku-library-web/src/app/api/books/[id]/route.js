// src/app/api/books/[id]/route.js
import { NextResponse } from "next/server";

// แนะนำให้ดึงจาก Environment Variable ที่เราตั้งไว้ใน Vercel
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// --- 1. GET: ดึงข้อมูลหนังสือรายเล่ม ---
export async function GET(req, { params }) {
  const { id } = params;

  try {
    if (!BACKEND_URL) throw new Error("NEXT_PUBLIC_API_URL is missing");

    // ยิงตรงไปที่ Render (เช่น https://...render.com/books/1)
    const resp = await fetch(`${BACKEND_URL}/books/${id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await resp.json();

    if (!resp.ok) {
      return NextResponse.json(
        { message: json.message || "ไม่พบข้อมูลหนังสือ" },
        { status: resp.status }
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("[Get Book ID Error]:", error.message);
    return NextResponse.json(
      { message: "เชื่อมต่อ Backend ไม่สำเร็จ", error: error.message },
      { status: 500 }
    );
  }
}

// --- 2. PUT: อัปเดตข้อมูลหนังสือ ---
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    if (!BACKEND_URL) throw new Error("NEXT_PUBLIC_API_URL is missing");

    const body = await req.json();
    const authHeader = req.headers.get("authorization"); // ดึง Bearer Token จาก Frontend

    const resp = await fetch(`${BACKEND_URL}/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // ส่งต่อ Authorization Header ไปให้ Render เพื่อเช็คสิทธิ์ Admin
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const json = await resp.json();

    if (!resp.ok) {
      return NextResponse.json(
        { message: json.message || "แก้ไขข้อมูลไม่สำเร็จ" },
        { status: resp.status }
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("[Update Book Error]:", error.message);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย", error: error.message },
      { status: 500 }
    );
  }
}