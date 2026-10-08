import { createClient } from '@supabase/supabase-js'

// ดึงกุญแจที่เราแปะไว้ในไฟล์ .env.local มาใช้งาน
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// สร้างตัวเชื่อมต่อชื่อ supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)