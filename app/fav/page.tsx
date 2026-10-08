"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";

export default function FavPage() {
  const [favs, setFavs] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavs = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return window.location.href = "/login";

      // ดึงข้อมูลสินค้าที่ตรงกับตาราง Favorites
      const { data } = await supabase
        .from("favorites")
        .select(`
          product_id,
          products (*)
        `)
        .eq("user_email", session.user.email);

      if (data) setFavs(data.map(d => d.products));
    };
    fetchFavs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[70vh]">
      <h1 className="text-3xl font-black text-blue-900 mb-8">รายการโปรดของคุณ ❤️</h1>
      
      {favs.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-bold">ยังไม่มีสินค้าในรายการโปรดครับ 📭</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favs.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col group">
              <div className="bg-gray-100 rounded-2xl h-56 mb-4 flex items-center justify-center overflow-hidden">
                <img src={product.image_url || `https://placehold.co/400?text=${product.title}`} alt={product.title} className="w-full h-full object-cover"/>
              </div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{product.title}</h3>
              <div className="flex items-end justify-between mt-4">
                <p className="text-2xl font-black text-blue-900">${product.price}</p>
                <BuyButton product={product} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}