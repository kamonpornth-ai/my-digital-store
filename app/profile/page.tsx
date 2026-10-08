"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);

      // Check if admin
      const { data } = await supabase.from('user_roles').select('role').eq('email', session.user.email).single();
      if (data && data.role === 'admin') {
        setIsAdmin(true);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("👋 ออกจากระบบเรียบร้อยแล้ว");
    window.location.href = "/";
  };

  if (!user) return <div className="text-center py-20">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 mt-4 min-h-[70vh]">
      <h1 className="text-3xl font-black text-blue-900 mb-6">Profile 👤</h1>
      
      {/* การ์ดแสดงข้อมูล User */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-black text-2xl z-10">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <div className="z-10">
          <h2 className="font-bold text-gray-800 text-lg truncate w-48">{user.email.split('@')[0]}</h2>
          <p className="text-sm text-gray-500 truncate w-48">{user.email}</p>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-2xl translate-x-1/2 -translate-y-1/4"></div>
      </div>

      {isAdmin && (
        <Link href="/admin" className="block w-full bg-gray-900 text-white text-center py-4 rounded-2xl font-bold mb-6 hover:bg-black transition shadow-md">
          ⚙️ เข้าสู่ระบบหลังบ้าน (Admin)
        </Link>
      )}

      {/* เมนูการตั้งค่าต่างๆ */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mb-20">
        <button onClick={() => alert("ระบบตั้งค่าอยู่ในช่วงพัฒนาครับ")} className="text-left p-5 border-b border-gray-50 hover:bg-gray-50 transition font-medium text-gray-700">⚙️ Account Settings</button>
        <button onClick={() => alert("ระบบเปลี่ยนรหัสผ่านอยู่ในช่วงพัฒนาครับ")} className="text-left p-5 border-b border-gray-50 hover:bg-gray-50 transition font-medium text-gray-700">🔒 Password & Security</button>
        <button onClick={() => alert("ระบบเปลี่ยนภาษาอยู่ในช่วงพัฒนาครับ")} className="text-left p-5 border-b border-gray-50 hover:bg-gray-50 transition font-medium text-gray-700">🌐 Language</button>
        <button onClick={handleLogout} className="text-left p-5 hover:bg-red-50 text-red-500 transition font-bold">🚪 Log Out</button>
      </div>
    </div>
  );
}