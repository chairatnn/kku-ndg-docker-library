// "use client";

// import { useEffect, useState } from "react";
// import { Book, BookCheck, ArrowLeftRight, Users, AlertCircle } from "lucide-react";
// import ProtectedRoute from "./components/ProtectedRoute";

// export default function DashboardPage() {
//   const [data, setData] = useState({
//     stats: { totalBooks: 0, availableBooks: 0, currentBorrows: 0, totalUsers: 0, overdueCount: 0 },
//     recentBorrows: []
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const resp = await fetch("/api/dashboard/stats", {
//           headers: { "Authorization": `Bearer ${token}` }
//         });
//         const result = await resp.json();
//         if (resp.ok) {
//           setData(result);
//         }
//       } catch (err) {
//         console.error("Dashboard Fetch Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboard();
//   }, []);

//   if (loading) return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;

//   const { stats, recentBorrows } = data;

//   return (
//     <ProtectedRoute>
//       <main className="p-8 bg-slate-50 min-h-screen">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
//           <p className="text-slate-500 mt-1">ภาพรวมระบบห้องสมุด KKU Library</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard label="หนังสือทั้งหมด" value={stats.totalBooks} icon={Book} />
//           <StatCard label="พร้อมให้ยืม" value={stats.availableBooks} icon={BookCheck} />
//           <StatCard label="กำลังถูกยืม" value={stats.currentBorrows} icon={ArrowLeftRight} />
//           <StatCard label="ผู้ใช้งานทั้งหมด" value={stats.totalUsers} icon={Users} />
//         </div>

//         {/* Alert Box - ใช้ข้อมูลจริงจาก Database */}
//         {Number(stats.overdueCount) > 0 && (
//           <div className="mb-8 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 shadow-sm transition-all animate-in fade-in">
//             <AlertCircle className="h-5 w-5" />
//             <span className="font-semibold text-sm">มีรายการค้างส่ง {stats.overdueCount} รายการ</span>
//           </div>
//         )}

//         {/* Table รายการยืมล่าสุด */}
//         <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
//           <div className="p-6 border-b border-slate-50">
//             <h2 className="text-xl font-bold text-slate-900">รายการยืมล่าสุด</h2>
//             <p className="text-sm text-slate-400 mt-1">แสดง 5 รายการล่าสุด</p>
//           </div>
          
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-slate-50/50">
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">รหัส</th>
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">ผู้ยืม</th>
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">หนังสือ</th>
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">วันกำหนดคืน</th>
//                 <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">สถานะ</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {recentBorrows.map((row) => (
//                 <tr key={row.id} className="hover:bg-slate-50 transition-colors">
//                   <td className="px-6 py-5 text-sm font-medium text-slate-600">BR{row.id.toString().padStart(3, '0')}</td>
//                   <td className="px-6 py-5 text-sm text-slate-800 font-medium">{row.user_name}</td>
//                   <td className="px-6 py-5 text-sm text-slate-600">{row.book_title}</td>
//                   <td className="px-6 py-5 text-sm text-slate-600">{row.due_date}</td>
//                   <td className="px-6 py-5">
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//                       row.status === 'Returned' ? 'bg-slate-100 text-slate-500' :
//                       row.status === 'Overdue' ? 'bg-rose-50 text-rose-500' : 
//                       'bg-orange-50 text-orange-400'
//                     }`}>
//                       {row.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </ProtectedRoute>
//   );
// }

// function StatCard({ label, value, icon: Icon }) {
//   return (
//     <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start">
//       <div>
//         <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tight">{label}</p>
//         <span className="text-4xl font-bold text-slate-900 leading-none">{value}</span>
//       </div>
//       <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><Icon className="h-6 w-6" /></div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { 
  Book, 
  BookCheck, 
  ArrowLeftRight, 
  Users, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState({
    stats: { totalBooks: 0, availableBooks: 0, currentBorrows: 0, totalUsers: 0, overdueCount: 0 },
    recentBorrows: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const resp = await fetch("/api/dashboard/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await resp.json();
        if (resp.ok) {
          setData(result);
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-400 gap-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="font-medium animate-pulse">กำลังเตรียมข้อมูล Dashboard...</p>
      </div>
    );
  }

  const { stats, recentBorrows } = data;

  return (
    <ProtectedRoute>
      <main className="p-6 md:p-10 bg-slate-50 min-h-screen font-sans text-slate-900">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <LayoutDashboard size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Overview</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500 font-medium">ยินดีต้อนรับกลับมา! นี่คือภาพรวมระบบห้องสมุดวันนี้</p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/books" className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              <Book size={18} /> จัดการหนังสือ
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="หนังสือทั้งหมด" value={stats.totalBooks} icon={Book} color="blue" />
          <StatCard label="พร้อมให้ยืม" value={stats.availableBooks} icon={BookCheck} color="emerald" />
          <StatCard label="กำลังถูกยืม" value={stats.currentBorrows} icon={ArrowLeftRight} color="orange" />
          <StatCard label="ผู้ใช้งาน" value={stats.totalUsers} icon={Users} color="indigo" />
        </div>

        {/* Alert & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">รายการยืมล่าสุด</h2>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Recent Activity</p>
                </div>
                <Link href="/borrows" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                  ดูทั้งหมด <ChevronRight size={14} />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/30">
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">รหัสยืม</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ผู้ใช้งาน</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">กำหนดคืน</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentBorrows.length > 0 ? (
                      recentBorrows.map((row) => (
                        <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5 text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                            #{row.id.toString().padStart(4, '0')}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{row.user_name}</span>
                              <span className="text-xs text-slate-400 truncate max-w-[150px]">{row.book_title}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-medium text-slate-600 italic">
                            {new Date(row.due_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="px-8 py-5">
                            <StatusBadge status={row.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-10 text-center text-slate-400 italic">ไม่มีรายการยืมในช่วงนี้</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Status & Alerts */}
          <div className="space-y-6">
            {/* Overdue Alert Card */}
            <div className={`p-8 rounded-[2.5rem] border transition-all ${
              Number(stats.overdueCount) > 0 
              ? 'bg-rose-50 border-rose-100 text-rose-700 shadow-rose-100/50 shadow-lg' 
              : 'bg-white border-slate-100 text-slate-400'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${Number(stats.overdueCount) > 0 ? 'bg-rose-500 text-white' : 'bg-slate-100'}`}>
                  <AlertCircle size={20} />
                </div>
                <h3 className="font-bold text-lg">ค้างส่ง (Overdue)</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black">{stats.overdueCount}</span>
                <span className="text-sm font-bold mb-2 uppercase opacity-70">Items</span>
              </div>
              <p className="text-sm mt-4 font-medium opacity-80">
                {Number(stats.overdueCount) > 0 
                  ? "มีรายการที่เลยกำหนดคืน กรุณาเร่งติดตามการส่งคืนหนังสือ" 
                  : "ไม่มีหนังสือค้างส่งในขณะนี้"}
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <TrendingUp className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/5 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold mb-2">KKU Library Node</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ระบบจัดการห้องสมุดเวอร์ชัน 1.0.4 <br/> สถานะการเชื่อมต่อ: <span className="text-emerald-400 font-bold">Online</span>
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                <Clock size={12} /> {new Date().toLocaleDateString('th-TH')}
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

// Sub-components
function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: "text-blue-500 bg-blue-50",
    emerald: "text-emerald-500 bg-emerald-50",
    orange: "text-orange-500 bg-orange-50",
    indigo: "text-indigo-500 bg-indigo-50",
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">{label}</p>
        <span className="text-4xl font-black text-slate-900 tracking-tight">{value.toLocaleString()}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Returned: "bg-slate-100 text-slate-500 border-slate-200",
    Overdue: "bg-rose-100 text-rose-600 border-rose-200",
    Borrowed: "bg-orange-100 text-orange-600 border-orange-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${styles[status] || styles.Borrowed}`}>
      {status}
    </span>
  );
}