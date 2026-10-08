export default function FavoritePage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">My Favorites ❤️</h1>
      
      {/* กล่องข้อความกรณีที่ยังไม่มีสินค้าที่ชอบ */}
      <div className="bg-white rounded-3xl p-10 border border-gray-100 text-center shadow-sm">
        <p className="text-gray-500 mb-4">คุณยังไม่ได้กดหัวใจให้สินค้าชิ้นไหนเลย</p>
        <button className="bg-blue-50 text-blue-900 px-6 py-2 rounded-full font-medium hover:bg-blue-100 transition">
          ไปค้นหาสินค้าเลย
        </button>
      </div>
    </div>
  );
}