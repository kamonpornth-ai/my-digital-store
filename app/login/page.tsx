"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; // ดึงระบบหลังบ้านมาใช้

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  // สร้างตัวแปรมาเก็บค่าอีเมลกับรหัสผ่านตอนที่เราพิมพ์
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันนี้จะทำงานตอนเรากดปุ่ม Sign In หรือ Sign Up
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชเอง
    setLoading(true);

    if (isLogin) {
      // 🔵 โหมดล็อกอิน
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert("❌ ล็อกอินไม่สำเร็จ: " + error.message);
      } else {
        alert("✅ เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับครับ");
        window.location.href = "/"; // ล็อกอินผ่าน ให้เด้งกลับไปหน้าแรก
      }
    } else {
            // 🟢 โหมดสมัครสมาชิก
      const { error } = await supabase.auth.signUp({
        email: email.trim(), // เติม .trim() เพื่อตัดเว้นวรรคที่แอบซ่อนอยู่ออกให้อัตโนมัติ!
        password,
      });
      if (error) {
        alert("❌ สมัครไม่สำเร็จ: " + error.message);
      } else {
        alert("✅ สมัครสมาชิกสำเร็จ! (ถ้าเข้าสู่ระบบไม่ได้ ลองเช็คอีเมลเพื่อกดยืนยันตัวตนดูก่อนนะครับ)");
        setIsLogin(true); // สมัครเสร็จ สลับหน้าต่างกลับไปหน้าล็อกอินให้
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 mt-10 lg:mt-20 mb-20">
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold text-blue-900 tracking-tight mb-2">
            {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
          </h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? "เข้าสู่ระบบเพื่อช้อปปิ้งต่อได้เลย" : "สมัครสมาชิกฟรี เพื่อเข้าถึงคลังสินค้าดิจิทัล"}
          </p>
        </div>

        {/* ผูกฟังก์ชัน handleSubmit เข้ากับฟอร์ม */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition"
            />
          </div>

          <button 
  type="button"
  onClick={handleSubmit}
  disabled={loading}
  className="bg-blue-900 text-white w-full py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition shadow-lg shadow-blue-900/30 mt-2 active:scale-95 disabled:bg-gray-400"
>
  {loading ? "กำลังโหลด..." : (isLogin ? "Sign In" : "Sign Up")}
</button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-gray-500 relative z-10">
          {isLogin ? "ยังไม่มีบัญชีใช่ไหม? " : "มีบัญชีอยู่แล้วใช่ไหม? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className="text-blue-600 hover:text-blue-900 font-bold transition ml-1"
          >
            {isLogin ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </button>
        </div>
      </div>
    </div>
  );
}