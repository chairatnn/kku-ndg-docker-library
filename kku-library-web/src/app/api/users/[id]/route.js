import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_API_URL;

// 🚩 สำหรับการแก้ไข (PUT)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    // ยิงไปที่ Backend จริง (ตรวจสอบ Path ให้ตรงกับ app.js)
    const resp = await fetch(`${backendUrl}/api/users/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    return NextResponse.json({ message: "Update Proxy Error" }, { status: 500 });
  }
}

// 🚩 สำหรับการลบ (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');

    const resp = await fetch(`${backendUrl}/api/users/${id}`, {
      method: 'DELETE',
      headers: { 
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
    });

    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error) {
    return NextResponse.json({ message: "Delete Proxy Error" }, { status: 500 });
  }
}