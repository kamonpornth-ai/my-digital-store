"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // State สำหรับแก้ไขโปรไฟล์
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user?.email) {
      window.location.href = "/login";
      return;
    }
    setUser(session.user);
    setEditName(session.user.user_metadata?.display_name || session.user.email.split('@')[0]);

    // Check if admin
    const { data } = await supabase.from('user_roles').select('role').eq('email', session.user.email).single();
    if (data && data.role === 'admin') {
      setIsAdmin(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("👋 ออกจากระบบเรียบร้อยแล้ว");
    window.location.href = "/";
  };

  const handleSaveProfile = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let finalAvatarUrl = user.user_metadata?.avatar_url;

    // แอบใช้ถัง product-images ในการอัปโหลดรูปโปรไฟล์เพื่อความง่าย
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalAvatarUrl = publicUrl;
      } else {
        alert("อัปโหลดรูปไม่สำเร็จ: " + uploadError.message);
      }
    }

    // อัปเดตข้อมูลใน Supabase Auth โดยตรง
    const { data, error } = await supabase.auth.updateUser({
      data: {
        display_name: editName,
        avatar_url: finalAvatarUrl
      }
    });

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      alert("✅ อัปเดตโปรไฟล์เรียบร้อยแล้ว!");
      setUser(data.user);
      setIsEditing(false);
    }
    setLoading(false);
  };

  if (!user) return <div className="text-center py-20 font-bold text-gray-500">กำลังโหลดข้อมูล...</div>;

  // ดึงชื่อและรูปภาพ (ถ้ามี) ถ้าไม่มีให้ใช้อีเมลท่อนแรก
  const displayName = user.user_metadata?.display_name || user.email.split('@')[0];
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 mt-4 min-h-[70vh]">
      <h1 className="text-3xl font-black text-blue-900 mb-6">Profile 👤</h1>
      
      {/* การ์ดแสดงข้อมูล User */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-black text-2xl z-10 overflow-hidden border-2 border-white shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="z-10 flex-grow">
          <h2 className="font-bold text-gray-800 text-lg truncate w-48">{displayName}</h2>
          <p className="text-sm text-gray-500 truncate w-48">{user.email}</p>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full opacity-50 blur-2xl translate-x-1/2 -translate-y-1/4"></div>
      </div>

      {isAdmin && (
        <Link href="/admin" className="block w-full bg-gray-900 text-white text-center py-4 rounded-2xl font-bold mb-6 hover:bg-black transition shadow-md">
          ⚙️ เข้าสู่ระบบหลังบ้าน (Admin)
        </Link>
      )}

      {/* เมนูการตั้งค่า */}
      {isEditing ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-20">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">แก้ไขโปรไฟล์ 📝</h3>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">ชื่อแสดงผล</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-900/20 outline-none transition" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 ml-1">รูปโปรไฟล์ (อัปโหลดรูปจากเครื่อง)</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-900 file:font-bold hover:file:bg-blue-200 transition" />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-full font-bold hover:bg-gray-200 transition">ยกเลิก</button>
              <button type="submit" disabled={loading} className="flex-grow bg-blue-900 text-white py-3 rounded-full font-bold shadow-md hover:bg-blue-800 transition">
                {loading ? "กำลังอัปเดต..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col mb-20">
          <button onClick={() => setIsEditing(true)} className="text-left p-5 border-b border-gray-50 hover:bg-gray-50 transition font-medium text-gray-700">⚙️ Account Settings</button>
          

          <button onClick={handleLogout} className="text-left p-5 hover:bg-red-50 text-red-500 transition font-bold">🚪 Log Out</button>
        </div>
      )}
    </div>
  );
}
