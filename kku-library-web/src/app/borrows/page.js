"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoute";

export default function BorrowPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // State สำหรับ Role และสิทธิ์
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  // State สำหรับ Form
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = "/api";

  useEffect(() => {
    // 1. ดึงข้อมูล User จาก LocalStorage
    const role = localStorage.getItem("memberRole");
    const uid = localStorage.getItem("userId");
    setUserRole(role);
    setCurrentUserId(uid);

    // 2. กำหนดค่าเริ่มต้นเป็น 7 วันนับจากวันนี้
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const dateStr = defaultDate.toISOString().split("T")[0];
    setDueDate(dateStr);

    // 3. ถ้าเป็น Student ให้ล็อกผู้ยืมเป็นตัวเองทันที
    if (role === "Student" && uid) {
      setSelectedUser(uid);
    }

    async function fetchOptions() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const resp = await fetch(`${API_BASE}/borrows/options`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (resp.ok) {
          const json = await resp.json();
          setUsers(json.users || []);
          setBooks(json.books || []);
        }
      } catch (err) {
        console.error("❌ Fetch options error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, []);

  // ตัวแปรเช็คสิทธิ์จัดการ (Admin/Librarian)
  const canManageAll = userRole === "Admin" || userRole === "Librarian";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedBook || !dueDate)
      return alert("กรุณากรอกข้อมูลให้ครบ");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const resp = await fetch(`${API_BASE}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: Number(selectedUser),
          bookId: Number(selectedBook),
          dueDate: dueDate,
        }),
      });

      if (resp.ok) {
        alert("บันทึกการยืมสำเร็จ");
        router.push("/"); 
      } else {
        const err = await resp.json();
        alert(err.message || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-slate-900">ยืมหนังสือ</h1>
        <p className="text-slate-500 mb-8">
          {canManageAll ? "ทำรายการยืมให้ผู้ใช้" : "ทำรายการยืมหนังสือด้วยตนเอง"}
        </p>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ผู้ยืม */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                ผู้ยืม * {!canManageAll && <span className="text-xs font-normal text-slate-400">(เฉพาะบัญชีของคุณ)</span>}
              </label>
              <select
                className={`w-full p-3 border rounded-xl outline-none transition-all ${
                  !canManageAll ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-200"
                }`}
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={!canManageAll} // 🚩 Student เปลี่ยนไม่ได้
              >
                {canManageAll ? (
                  <>
                    <option value="">-- เลือกผู้ใช้งาน --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </>
                ) : (
                  // Student จะเห็นแค่ชื่อตัวเอง
                  users.filter(u => String(u.id) === String(currentUserId)).map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))
                )}
              </select>
            </div>

            {/* หนังสือ */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                หนังสือ *
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 transition-all"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                <option value="">-- เลือกหนังสือที่ต้องการยืม --</option>
                {books.map((b) => (
                  <option key={b.book_id} value={b.book_id}>
                    {b.title} {b.author ? ` - ${b.author}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* วันที่กำหนดคืน */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                วันกำหนดคืน * {!canManageAll && <span className="text-xs font-normal text-slate-400">(Fixed 7 วัน)</span>}
              </label>
              <input
                type="date"
                className={`w-full p-3 border rounded-xl outline-none ${
                  !canManageAll ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-slate-50 border-slate-200"
                }`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                readOnly={!canManageAll} // 🚩 Student แก้ไขไม่ได้
              />
              <p className="text-xs text-slate-400 mt-2">
                {canManageAll ? "บรรณารักษ์สามารถปรับเปลี่ยนวันคืนได้" : "กำหนดคืนภายใน 7 วันตามระเบียบห้องสมุด"}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className={`w-full py-4 text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 ${
                canManageAll ? "bg-slate-900 hover:bg-slate-800" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? "กำลังบันทึก..." : "ยืนยันการยืมหนังสือ"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}