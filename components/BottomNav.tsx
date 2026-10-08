import Link from "next/link"; // นำเข้า Link สำหรับเปลี่ยนหน้า

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-2">
      <div className="flex justify-around items-center h-16 relative">
        
        {/* ลิงก์กลับหน้าแรก (Home) */}
        <Link href="/" className="text-gray-400 hover:text-blue-900 flex flex-col items-center">
          <span className="text-xs font-medium">Home</span>
        </Link>
        
        {/* ลิงก์ไปหน้า Favorite */}
        <Link href="/favorite" className="text-gray-400 hover:text-blue-900 flex flex-col items-center">
          <span className="text-xs font-medium">Favorite</span>
        </Link>
        
        {/* ปุ่ม Cart ตรงกลาง  */}
        <Link href="#" className="bg-blue-900 text-white w-14 h-14 rounded-full flex items-center justify-center absolute -top-5 left-1/2 transform -translate-x-1/2 shadow-lg border-4 border-gray-50">
          🛒
        </Link>
        
         {/*  Notification (แจ้งเตือน)  */}
        <Link href="#" className="text-gray-400 hover:text-blue-900 flex flex-col items-center">
          <span className="text-xs font-medium">Notify</span>
        </Link>
        
        {/* ลิงก์ไปหน้า Profile */}
        <Link href="/profile" className="text-gray-400 hover:text-blue-900 flex flex-col items-center">
          <span className="text-xs font-medium">Profile</span>
        </Link>

      </div>
    </div>
  );
}