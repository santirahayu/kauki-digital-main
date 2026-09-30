# 🚀 Kauki Digital - Modern Agency Website, Blog & Admin CMS

Website agency digital ultra-modern, elegan, dan berkonversi tinggi untuk **Kauki Digital** (https://www.kaukidigital.com/). Dilengkapi dengan sistem Artikel/Blog dinamis, Dashboard Admin CMS, integrasi database **Supabase**, dan siap di-deploy ke **Vercel** dengan 1-klik.

---

## ✨ Fitur Utama

1. **Desain Visual Ultra-Premium & Kredibel**:
   - Skema warna Midnight Navy & Royal Indigo Glassmorphism dengan aksen Cyan & Gold.
   - 100% Responsif di semua ukuran layar smartphone (iPhone, Android) dan desktop.
   - **Kalkulator Biaya & ROI Interaktif**: Simulasi harga website & add-on secara real-time dengan tombol pesan langsung ke WhatsApp.
   - **Showcase Portofolio & Case Studies**: Bukti performa (kecepatan 99/100, kenaikan konversi).
   - **Floating Smart WhatsApp Widget**: Direct chat WhatsApp dengan prefilled message.
2. **Sistem Artikel / Blog Dinamis (`articles.html` & `article-detail.html`)**:
   - Filter kategori (Tips Bisnis, Website, SEO, Domain & Email).
   - Live instant search.
   - Reader mode tipografi rapi dengan dukungan format Markdown.
   - Otomatis Table of Contents (Daftar Isi).
   - Tombol share ke WhatsApp, LinkedIn, dan salin link.
3. **Admin Panel CMS (`admin.html`)**:
   - Proteksi login PIN Admin (Default: `admin123`).
   - CRUD Artikel lengkap (Tambah, Edit, Hapus, Jadikan Draft/Publish, Featured).
   - Editor Markdown dengan **Live Side-by-Side Preview**.
   - Inbox Pesan Masuk (Leads) dari form konsultasi dengan tombol "Balas WA" instan.
   - Konfigurasi Supabase Project & Tombol One-Click Data Sync.
4. **Database Supabase + Hybrid Smart Offline Fallback**:
   - Berfungsi 100% out-of-the-box (Local Storage & Seed Data).
   - Siap terhubung ke Supabase Cloud PostgreSQL kapan saja.

---

## 📦 Panduan Setup Database Supabase

1. Buka [https://supabase.com](https://supabase.com) dan buat project baru (Gratis).
2. Di dashboard Supabase, buka menu **SQL Editor** > **New Query**.
3. Buka file `supabase-schema.sql` (atau klik tombol **"Salin SQL Schema"** di halaman Admin CMS), lalu paste ke SQL Editor dan klik **Run**.
4. Ambil **Project URL** dan **Anon Public Key** di menu **Project Settings > API**.
5. Buka halaman `/admin.html` di website Anda, masuk ke tab **Supabase & DB**, masukkan URL & Key, lalu klik **Simpan & Hubungkan**.
6. Klik **"Sinkronkan Data Lokal ke Supabase"** untuk mengunggah artikel awal ke cloud!

---

## ⚡ Panduan Deploy ke Vercel (1-Click Deploy)

Website ini sudah dilengkapi file `vercel.json` dan struktur statis yang sangat optimal:

### Cara 1: Lewat GitHub & Vercel Dashboard (Rekomendasi)
1. Upload/Push folder project ini ke repository GitHub Anda.
2. Buka [https://vercel.com](https://vercel.com) dan login.
3. Klik **Add New Project** > pilih repository GitHub Anda.
4. Klik **Deploy** (Semua pengaturan otomatis terdeteksi).
5. Selesai! Website Anda langsung live di URL `https://nama-project.vercel.app` atau custom domain Anda.

### Cara 2: Lewat Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🔐 Kredensial Admin Default
- **URL Admin**: `/admin.html`
- **PIN Default**: `admin123`

---

© 2026 Kauki Digital. All rights reserved.
