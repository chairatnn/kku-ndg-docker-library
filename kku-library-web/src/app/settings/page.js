"use client";

import { useState, useEffect } from "react";
import {
  Info,
  ShieldCheck,
  BookOpen,
  User,
  Code2,
  ExternalLink,
  Layers,
} from "lucide-react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function SettingsPage() {
  const systemInfo = {
    version: "1.0.4",
    buildDate: "2026-04-05",
    environment: "Production",
    framework: "Next.js 14 (App Router)",
    database: "PostgreSQL",
  };

  const [systemData, setSystemData] = useState(null);

  useEffect(() => {
    async function fetchSystemInfo() {
      const token = localStorage.getItem("accessToken");
      const resp = await fetch("/api/system/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const json = await resp.json();
        setSystemData(json.data);
      }
    }
    fetchSystemInfo();
  }, []);

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Layers className="h-8 w-8 text-blue-600" />
            ตั้งค่าและข้อมูลระบบ
          </h1>
          <p className="text-slate-500 mt-2">
            รายละเอียดเกี่ยวกับแอปพลิเคชัน KKU Library Backoffice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section 1: System Info Card */}
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                เกี่ยวกับระบบ (About System)
              </h2>
              <div className="grid grid-cols-2 gap-y-6 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Application Name</p>
                  <p className="font-semibold text-slate-700">
                    KKU Library Backoffice
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Version</p>
                  <p className="font-semibold text-slate-700">
                    {systemData?.version || systemInfo.version}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Framework</p>
                  <p className="font-semibold text-slate-700">
                    {systemInfo.framework}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Last Update</p>
                  <p className="font-semibold text-slate-700">
                    {systemInfo.buildDate}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Roles & Permissions Explanation */}
            <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                ระดับสิทธิ์การใช้งาน (Permissions)
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50">
                  <div className="bg-blue-100 p-2 rounded-lg h-fit">
                    <span className="text-xs font-bold text-blue-700">
                      Admin
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    จัดการผู้ใช้งานทั้งหมด, เพิ่ม/แก้ไข/ลบหนังสือ,
                    และบันทึกการคืนหนังสือของทุกคน
                  </p>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50">
                  <div className="bg-emerald-100 p-2 rounded-lg h-fit">
                    <span className="text-xs font-bold text-emerald-700">
                      Librarian
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    จัดการข้อมูลหนังสือและบันทึกการคืนหนังสือของนักศึกษา
                  </p>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50">
                  <div className="bg-orange-100 p-2 rounded-lg h-fit">
                    <span className="text-xs font-bold text-orange-700">
                      Student
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    ดูรายชื่อหนังสือ, ยืมหนังสือด้วยตนเอง (7 วัน),
                    และดูประวัติการยืมของตนเอง
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Section 3: Sidebar Info */}
          <div className="space-y-6">
            {/* Developer Card */}
            <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-md">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                ผู้พัฒนา
              </h2>
              <div className="space-y-4">
                <p className="text-slate-400 text-sm">
                  พัฒนาโดยนักศึกษามหาวิทยาลัยขอนแก่น
                  เพื่อสนับสนุนการใช้งานห้องสมุดที่ทันสมัย
                </p>
                <a
                  href="#"
                  className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 p-3 rounded-xl transition"
                >
                  <Code2 className="h-4 w-4" />
                  Source Code on GitHub
                </a>
              </div>
            </section>

            {/* Quick Links */}
            <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                คู่มือ
              </h2>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    วิธีการยืม-คืน <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    นโยบายความเป็นส่วนตัว <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-400 text-xs py-10">
          © 2026 KKU Library Backoffice Project. All rights reserved.
        </p>
      </main>
    </ProtectedRoute>
  );
}
