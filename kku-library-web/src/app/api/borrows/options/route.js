import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const authHeader = request.headers.get('authorization');

    // ยิงต่อไปยัง Backend จริงๆ ที่ Render
    const resp = await fetch(`${backendUrl}/api/borrows/options`, {
      headers: {
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      cache: 'no-store'
    });

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Error loading options" }, { status: 500 });
  }
}