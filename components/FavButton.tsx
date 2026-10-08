"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function FavButton({ product }: { product: any }) {
  const [isFav, setIsFav] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    checkFav();
  }, []);

  const checkFav = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // 🌟 1. ดักจับ Error ตรงนี้: ถ้าไม่มี Session หรือ ไม่มีอีเมล ให้หยุดทำงาน
    if (!session || !session.user.email) return; 
    
    // พอผ่านบรรทัดบนมาได้ TypeScript จะรู้ทันทีว่าอีเมลมีค่าแน่นอน ขีดแดงเลยหายไปครับ
    setUserEmail(session.user.email);

    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_email", session.user.email)
      .eq("product_id", product.id)
      .single();
    
    if (data) setIsFav(true);
  };

  const toggleFav = async (e: any) => {
    e.preventDefault(); 
    if (!userEmail) {
      alert("กรุณาล็อกอินก่อนกดหัวใจครับ!");
      return;
    }

    if (isFav) {
      await supabase.from("favorites").delete().eq("user_email", userEmail).eq("product_id", product.id);
      setIsFav(false);
    } else {
      await supabase.from("favorites").insert([{ user_email: userEmail, product_id: product.id }]);
      setIsFav(true);
    }
  };

  return (
    <button onClick={toggleFav} className="text-2xl hover:scale-125 transition duration-200">
      {isFav ? "❤️" : "🤍"}
    </button>
  );
}