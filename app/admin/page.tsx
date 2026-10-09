"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // 🌟 เพิ่ม State สำหรับเก็บไฟล์รูปภาพที่แอดมินเลือกจากคอม
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Templates",
    image_url: "",
    description: ""
  });

  // Sales Dashboard State
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  // คำนวณสรุปยอดขายแยกตามสินค้า
  const productSalesMap: Record<string, { title: string; quantity: number; revenue: number }> = {};
  allOrders.forEach(order => {
    order.items?.forEach((item: any) => {
      if (!productSalesMap[item.id]) {
        productSalesMap[item.id] = { title: item.title, quantity: 0, revenue: 0 };
      }
      productSalesMap[item.id].quantity += item.quantity;
      productSalesMap[item.id].revenue += (item.price * item.quantity);
    });
  });
  const bestSellers = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity);

  useEffect(() => {
    checkAdmin();
    fetchProducts();
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
      setAllOrders(data);
      setTotalOrders(data.length);
      const sum = data.reduce((acc, order) => acc + (order.total_price || 0), 0);
      setTotalSales(sum);
    }
  };

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("⛔ กรุณาล็อกอินก่อน!");
      window.location.href = "/";
      return;
    }
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('email', session.user.email).single();
    if (!roleData || roleData.role !== "admin") {
      alert("⛔ ห้ามเข้า! คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแลระบบ");
      window.location.href = "/";
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (data) setProducts(data);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = formData.image_url;

    // 🌟 1. เช็คว่าแอดมินมีการกดเลือกไฟล์รูปภาพใหม่ไหม?
    if (imageFile) {
      // ตั้งชื่อไฟล์ใหม่ด้วยเวลา (ป้องกันชื่อซ้ำ)
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      // อัปโหลดไฟล์เข้าถัง 'product-images' ที่เราเพิ่งสร้าง
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("❌ อัปโหลดรูปภาพล้มเหลว: " + uploadError.message);
        setLoading(false);
        return;
      }

      // ดึง URL จริงของรูปภาพที่เพิ่งอัปโหลดเสร็จบนเซิร์ฟเวอร์
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      finalImageUrl = publicUrl; // เอา URL นี้ไปบันทึกลง Database
    }

    // 🌟 2. เอาข้อมูลทั้งหมด (พร้อม URL รูป) ยัดลง Database
    const payload = {
      title: formData.title,
      price: Number(formData.price),
      category: formData.category,
      image_url: finalImageUrl || "https://placehold.co/600x400/eeeeee/999999?text=No+Image",
      description: formData.description
    };

    if (editingId) {
      await supabase.from("products").update(payload).eq("id", editingId);
      alert("✅ อัปเดตสินค้าเรียบร้อย!");
    } else {
      await supabase.from("products").insert([payload]);
      alert("✅ เพิ่มสินค้าชิ้นใหม่เรียบร้อย!");
    }

    // ล้างฟอร์มทั้งหมดหลังเซฟเสร็จ
    setFormData({ title: "", price: "", category: "Templates", image_url: "", description: "" });
    setImageFile(null); 
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    
    setEditingId(null);
    fetchProducts();
    setLoading(false);
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      description: product.description || ""
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${title}" ?`)) {
      await supabase.from("products").delete().eq("id", id);
      alert("🗑️ ลบสินค้าแล้ว");
      fetchProducts();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", price: "", category: "Templates", image_url: "", description: "" });
    setImageFile(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-black text-blue-900 mb-6">Admin Dashboard ⚙️</h1>

      {/* 📊 Sales Dashboard Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-900/20">
          <p className="text-blue-100 font-bold mb-1">ยอดขายรวมทั้งหมด</p>
          <h2 className="text-4xl font-black">${totalSales.toFixed(2)}</h2>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-3xl p-6 text-white shadow-lg shadow-green-600/20">
          <p className="text-green-100 font-bold mb-1">จำนวนคำสั่งซื้อ</p>
          <h2 className="text-4xl font-black">{totalOrders} <span className="text-lg font-medium">รายการ</span></h2>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20">
          <p className="text-orange-100 font-bold mb-1">จำนวนสินค้าในระบบ</p>
          <h2 className="text-4xl font-black">{products.length} <span className="text-lg font-medium">ชิ้น</span></h2>
        </div>
      </div>

      {/* 🏆 Best Sellers (Product Sales Breakdown) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-10 overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 mb-6">🏆 สรุปยอดขายแยกตามสินค้า</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-blue-50 text-blue-900 font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">อันดับ</th>
                <th className="px-4 py-3">ชื่อสินค้า</th>
                <th className="px-4 py-3">ขายได้ทั้งหมด (ชิ้น)</th>
                <th className="px-4 py-3 rounded-r-xl">รายได้รวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bestSellers.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-bold text-gray-800">#{idx + 1}</td>
                  <td className="px-4 py-4 font-medium text-gray-800">{product.title}</td>
                  <td className="px-4 py-4 font-bold text-green-600">{product.quantity} ชิ้น</td>
                  <td className="px-4 py-4 font-bold text-blue-600">${product.revenue}</td>
                </tr>
              ))}
              {bestSellers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">ยังไม่มีสินค้าที่ขายได้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📦 Recent Orders List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-10 overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 mb-6">📜 รายการสั่งซื้อล่าสุด</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">รหัสสั่งซื้อ</th>
                <th className="px-4 py-3">อีเมลลูกค้า</th>
                <th className="px-4 py-3">สินค้าที่ซื้อ</th>
                <th className="px-4 py-3">ยอดรวม</th>
                <th className="px-4 py-3 rounded-r-xl">วันที่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allOrders.slice(0, 10).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-mono text-xs">{order.id.toString().slice(0, 8)}</td>
                  <td className="px-4 py-4 font-medium text-gray-800">{order.user_email}</td>
                  <td className="px-4 py-4">
                    <ul className="list-disc pl-4">
                      {order.items?.map((item: any, idx: number) => (
                        <li key={idx} className="line-clamp-1">{item.title} (x{item.quantity})</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4 font-bold text-blue-600">${order.total_price}</td>
                  <td className="px-4 py-4">
                    {new Date(order.created_at).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
              {allOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">ยังไม่มีรายการสั่งซื้อ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ฝั่งซ้าย: ฟอร์ม */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingId ? "✏️ แก้ไขสินค้า" : "➕ เพิ่มสินค้าใหม่"}
            </h2>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">ชื่อสินค้า</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-900/20 outline-none transition" />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-sm font-bold text-gray-700 ml-1">ราคา ($)</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-900/20 outline-none transition" />
                </div>
                <div className="w-1/2">
                  <label className="text-sm font-bold text-gray-700 ml-1">หมวดหมู่</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-900/20 outline-none transition">
                    <option value="Templates">Templates</option>
                    <option value="E-Books">E-Books</option>
                    <option value="Courses">Courses</option>
                  </select>
                </div>
              </div>

              {/* 🌟 จุดที่อัปเกรดเป็นปุ่มเลือกไฟล์จากคอมพิวเตอร์ */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <label className="text-sm font-bold text-blue-900 mb-2 block">อัปโหลดรูปภาพสินค้า 🖼️</label>
                <input 
                  id="file-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-900 file:text-white hover:file:bg-blue-800 transition" 
                />
                {formData.image_url && !imageFile && (
                  <div className="mt-3 flex items-center gap-2">
                    <img src={formData.image_url} alt="Current" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-xs text-green-600 font-bold">✓ มีรูปภาพเดิมอยู่แล้ว (เลือกใหม่เพื่อเปลี่ยน)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">รายละเอียดสินค้า</label>
                <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-900/20 outline-none transition" />
              </div>

              <div className="flex gap-3 mt-2">
                {editingId && (
                  <button type="button" onClick={handleCancel} className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-full font-bold hover:bg-gray-200 transition">
                    ยกเลิก
                  </button>
                )}
                <button type="submit" disabled={loading} className={`flex-grow text-white py-3 rounded-full font-bold transition shadow-md ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-900 hover:bg-blue-800'}`}>
                  {loading ? "กำลังบันทึกรูปและข้อมูล..." : (editingId ? "บันทึกการแก้ไข" : "เพิ่มสินค้า")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ฝั่งขวา: ตาราง */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📦 คลังสินค้า ({products.length})</h2>
            <div className="flex flex-col gap-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">{product.category}</p>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                      <p className="text-blue-600 font-black">${product.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition duration-200">
                    <button onClick={() => handleEdit(product)} className="bg-white text-orange-500 border border-orange-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-50 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id, product.title)} className="bg-white text-red-500 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}