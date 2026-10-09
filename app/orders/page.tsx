"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_email", session.user.email)
      .order("created_at", { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  }

  const handleDownload = (productName: string) => {
    alert(`ดาวน์โหลดสำเร็จ!\nกำลังบันทึกไฟล์: ${productName} (โหมดจำลอง)`);
  };

  if (loading) return <div className="p-8 text-center text-gray-500 mt-20">กำลังโหลดประวัติการสั่งซื้อ...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">ประวัติการสั่งซื้อ & ดาวน์โหลด</h1>
      
      {orders.length === 0 ? (
        <div className="text-center bg-gray-50 p-8 rounded-lg border border-gray-100 mt-10">
          <p className="text-gray-500 mb-4">คุณยังไม่มีประวัติการสั่งซื้อสินค้าครับ</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium inline-block">
            กลับไปช้อปปิ้ง
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center border-b pb-3 mb-3">
                <p className="text-sm text-gray-500 font-medium">รหัสสั่งซื้อ: #{order.id.toString().slice(0, 8)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="space-y-4">
                {order.items && order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-4 rounded-lg gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-gray-800">{item.title}</p>
                        <p className="text-sm text-blue-600 font-bold">${item.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(item.title)}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                    >
                      ⬇️ ดาวน์โหลดไฟล์
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="text-right mt-4 pt-3 border-t">
                <p className="font-bold text-gray-800">ยอดชำระรวม: <span className="text-blue-900">${order.total_price}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
