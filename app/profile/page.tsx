export default function ProfilePage() {
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 mt-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Profile 👤</h1>
      
      {/* การ์ดแสดงข้อมูล User */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-bold text-2xl">U</div>
        <div>
          <h2 className="font-bold text-gray-800 text-lg">User Name</h2>
          <p className="text-sm text-gray-500">user@example.com</p>
        </div>
      </div>

      {/* เมนูการตั้งค่าต่างๆ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <button className="text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition">⚙️ Account Settings</button>
        <button className="text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition">🔒 Password & Security</button>
        <button className="text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition">🌐 Language</button>
        <button className="text-left p-4 hover:bg-red-50 text-red-500 transition font-medium">🚪 Log Out</button>
      </div>
    </div>
  );
}