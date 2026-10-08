"use client";
import { useCart } from "@/context/CartContext";

export default function BuyButton({ product }: { product: any }) {
  const { addToCart } = useCart();

  const handleBuy = () => {
    addToCart(product); // คำสั่งโยนของเข้าสมอง
    alert(`✅ หยิบ "${product.title}" ลงตะกร้าสำเร็จ!`);
  };

  return (
    <button 
      onClick={handleBuy}
      className="bg-blue-900 text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-blue-800 transition w-full shadow-lg shadow-blue-900/30 active:scale-95"
    >
      Buy Now 💳
    </button>
  );
}