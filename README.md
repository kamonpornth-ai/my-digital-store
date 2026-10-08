# 🛒 D-Store (Digital Store)

A modern, full-stack E-Commerce web application built for selling digital products (Templates, E-Books, Courses). 

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

## 🚀 Live Demo
**[View Live Website](https://my-digital-store-gilt.vercel.app/)**

---

## ✨ Key Features

### 🛍️ User Features
- **Authentication:** Secure sign-up and login via Supabase Auth.
- **Dynamic Filtering:** Instantly filter products by category without full page reloads using Next.js `useSearchParams`.
- **Shopping Cart:** Add, remove, and calculate total prices globally using React Context API.
- **Favorites System:** "Like" products and view them in a dedicated wishlist page.
- **User Profile:** Update display name and upload personalized avatars.
- **Responsive Design:** Mobile-first approach with a custom Bottom Navigation bar for mobile screens, and a dynamic Navbar for desktop.

### 👑 Admin Features
- **Role-Based Access Control:** Secure routes strictly available to users with `admin` roles (verified via `user_roles` table).
- **Product Management:** Full CRUD (Create, Read, Update, Delete) operations for inventory directly from the dashboard.
- **Cloud Storage:** Upload product thumbnail images directly to Supabase Storage buckets.

---

## 🛠️ Tech Stack
- **Frontend:** React, Next.js (App Router), Tailwind CSS
- **Backend (BaaS):** Supabase
- **Database:** PostgreSQL (via Supabase)
- **State Management:** React Context API
- **Deployment:** Vercel

---

## 🗄️ Database Schema
This project utilizes the following main tables:
- `products`: Stores product details (`id`, `title`, `price`, `category`, `image_url`, `description`).
- `user_roles`: Manages access control (`email`, `role: 'admin' | 'user'`).
- `favorites`: Stores relationships between users and their liked products (`id`, `user_email`, `product_id`).
- `orders`: Records completed checkouts and cart items stored as JSONB.

---

## ⚙️ Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/kamonpornth-ai/my-digital-store.git
cd my-digital-store
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up Environment Variables**
Create a `.env.local` file in the root directory and add your Supabase keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**4. Run the development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
