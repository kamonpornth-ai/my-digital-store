"use client";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";
import FavButton from "@/components/FavButton"; // 🌟 นำเข้าปุ่มหัวใจ
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* ป้ายแบนเนอร์ */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-[2rem] p-8 sm:p-12 mb-12 flex flex-col md:flex-row items-center justify-between border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 mb-6 md:mb-0">
          <h1 className="text-4xl sm:text-5xl font-black text-blue-900 mb-4 tracking-tight">
            Digital Products <br/>
          </h1>
          <p className="text-gray-600 text-lg max-w-md font-medium">
            แหล่งรวมสินค้า Digitals. </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-200 rounded-full opacity-40 blur-3xl translate-x-1/2 -translate-y-1/4"></div>
      </div>

      <Suspense fallback={<div className="text-center py-20 font-bold text-gray-400">กำลังโหลดสินค้า...</div>}>
        <ProductGrid />
      </Suspense>

    </main>
  );
}

function ProductGrid() {
  const searchParams = useSearchParams();
  const category = searchParams.get("cat");
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*").order("id", { ascending: true });
      
      if (category) {
        query = query.eq("category", category);
      }
      
      const { data } = await query;
      if (data) setProducts(data);
      setLoading(false);
    };
    
    fetchProducts();
  }, [category]);

  return (
    <>
      <h2 className="text-2xl font-black text-blue-900 mb-6 flex items-center gap-2">
        {category ? ` ${category}` : " สินค้าทั้งหมด"}
      </h2>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-bold">กำลังโหลดสินค้า...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl transition duration-300">
              <Link href={`/product/${product.id}`}>
                <div className="bg-gray-100 rounded-2xl h-56 mb-4 flex items-center justify-center overflow-hidden">
                  <img src={product.image_url || `https://placehold.co/400?text=${product.title}`} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300"/>
                </div>
              </Link>
              <div className="flex-grow">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition">{product.title}</h3>
                </Link>
              </div>
              <div className="flex items-end justify-between mt-4">
                <p className="text-2xl font-black text-blue-900">${product.price}</p>
                
                {/* 🌟 จุดที่เพิ่มปุ่มหัวใจเข้ามาอยู่ข้างๆ ปุ่มซื้อ */}
                <div className="flex items-center gap-3">
                  <BuyButton product={product} />
                  <FavButton product={product} />
                
                </div>

              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
              <p className="text-xl font-bold text-gray-400 mb-2">ไม่พบสินค้าในหมวดหมู่นี้</p>
              <Link href="/" className="text-blue-600 hover:underline font-bold">กลับไปดูสินค้าทั้งหมด</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
