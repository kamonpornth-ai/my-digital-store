"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // 🚀 ฟังก์ชันทำงานตอนกดปุ่มชำระเงิน
  const handleCheckout = async () => {
    setLoading(true);
    // 1. เช็คว่าล็อกอินหรือยัง
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("🔒 กรุณาล็อกอินก่อนทำการชำระเงินครับ!");
      window.location.href = "/login";
      return;
    }

    // 2. เตรียมข้อมูลออเดอร์
    const orderPayload = {
      user_email: session.user.email,
      total_price: totalPrice,
      items: items // เซฟข้อมูลตะกร้าลงฐานข้อมูล
    };

    // 3. ส่งเข้าตาราง orders
    const { error } = await supabase.from('orders').insert([orderPayload]);

    if (error) {
      alert("❌ เกิดข้อผิดพลาด: " + error.message);
    } else {
      alert("🎉 สั่งซื้อสำเร็จ! ขอบคุณที่อุดหนุนครับ");
      clearCart(); // ล้างตะกร้า
      window.location.href = "/"; // กลับหน้าแรก
    }
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ตะกร้าของคุณว่างเปล่า 🛒</h2>
        <Link href="/" className="bg-blue-900 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-800 transition shadow-md">
          กลับไปเลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-black text-blue-900 mb-8">ตะกร้าสินค้าของคุณ 🛒</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full">
                 <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200">
                   <img src={item.image_url || `https://placehold.co/400?text=No+Image`} alt={item.title} className="w-full h-full object-cover"/>
                 </div>
                 <div className="flex-grow">
                   <h3 className="font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                   <p className="text-blue-600 font-black">${item.price}</p>
                 </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-gray-600 hover:text-black font-bold px-2 text-lg">-</button>
                  <span className="font-bold w-6 text-center text-gray-800">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-600 hover:text-black font-bold px-2 text-lg">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 font-bold bg-red-50 p-2 rounded-full transition">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">สรุปคำสั่งซื้อ</h2>
            <div className="flex justify-between mb-4 text-gray-600 font-medium">
              <span>ยอดรวม ({items.length} รายการ)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="flex justify-between mb-8 text-xl font-black text-blue-900">
              <span>ยอดสุทธิ</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={loading}
              className="w-full bg-blue-900 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition shadow-lg shadow-blue-900/30 disabled:bg-gray-400 active:scale-95"
            >
              {loading ? "กำลังประมวลผล..." : "ชำระเงิน (Checkout) 💳"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}