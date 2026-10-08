import { supabase } from "@/lib/supabase";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single();

  if (!product) {
    return <div className="p-8 text-center text-xl mt-10">ไม่พบสินค้านี้ 😭</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-4">
      <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block">
        &larr; กลับหน้าหลัก
      </Link>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="aspect-video md:aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
            <img src={product.image_url} alt={product.title} className="object-cover w-full h-full" />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <p className="text-sm text-gray-400 font-bold tracking-wider uppercase mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>
          <p className="text-4xl font-black text-blue-900 mb-6">
            ${product.price}
          </p>
          
          {/* ดึงคำอธิบายจาก Supabase มาโชว์ */}
          <div className="text-gray-600 mb-8 leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100 whitespace-pre-line">
            {product.description || "ยังไม่มีรายละเอียดสินค้านี้"}
          </div>

          {/* เรียกใช้ปุ่มที่โต้ตอบได้ */}
          <BuyButton product={product} />
        </div>
      </div>
    </div>
  );
}