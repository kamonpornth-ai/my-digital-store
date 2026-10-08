"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const { totalItems } = useCart();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async (currentUser: any) => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.from('user_roles').select('role').eq('email', currentUser.email).single();
      if (data && data.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkUserRole(session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkUserRole(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("👋 ออกจากระบบเรียบร้อยแล้ว");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="font-black text-2xl text-blue-900 tracking-tighter hover:scale-105 transition">
            D-Store
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-500 hover:text-blue-900 font-bold text-sm transition">All Products</Link>
            <Link href="/?cat=Templates" className="text-gray-500 hover:text-blue-900 font-bold text-sm transition">Templates</Link>
            <Link href="/?cat=E-Books" className="text-gray-500 hover:text-blue-900 font-bold text-sm transition">E-Books</Link>
            <Link href="/?cat=Courses" className="text-gray-500 hover:text-blue-900 font-bold text-sm transition">Courses</Link>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* 🌟 ปุ่มทางเข้าหน้ารายการโปรด (Favorites) */}
            <Link href="/fav" className="relative text-gray-600 hover:scale-110 transition text-xl sm:text-2xl" title="รายการโปรด">
              ❤️
            </Link>

            <Link href="/cart" className="relative text-gray-600 hover:text-blue-900 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {isAdmin && (
                  <Link href="/admin" className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-black transition shadow-sm hidden sm:inline-block">
                    ⚙️ Dashboard
                  </Link>
                )}
                <span className="text-xs sm:text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hidden sm:inline-block">
                  {user.email}
                </span>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition shadow-sm">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition shadow-sm">
                Login
              </Link>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
}