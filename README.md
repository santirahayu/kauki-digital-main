# Kauki Digital - Web & Backend Application

Aplikasi web modern untuk **Kauki Digital** dengan backend Node.js / Express dan database MySQL.

---

## 📂 Struktur Proyek
- [`backend_kaukidigital/`](file:///c:/Users/Lenovo/Documents/Kauki%20Digital/backend_kaukidigital) : REST API Server (Node.js, Express, MySQL connection pool `mysql2`)
- [`web kauki/`](file:///c:/Users/Lenovo/Documents/Kauki%20Digital/web%20kauki) : Single-Page Application (React, Vite, Tailwind CSS)

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Backend (Port 5000)
Buka terminal baru:
```bash
cd "backend_kaukidigital"
npm run dev
```
Backend API aktif di: **`http://localhost:5000`**

### 2. Menjalankan Frontend (Port 3000)
Buka terminal kedua:
```bash
cd "web kauki"
pnpm run dev
# atau npm run dev
```
Frontend web aktif di: **`http://localhost:3000`**

---

## 🗄️ Database MySQL (DBeaver)
- **Database Name**: `kauki_digital`
- **Tabel**:
  - `articles` (Menyimpan artikel wawasan & edukasi bisnis)
  - `inquiries` (Menyimpan formulir kontak & pesanan dari klien)
- Script SQL lengkap tersedia di: [`backend_kaukidigital/sql/schema.sql`](file:///c:/Users/Lenovo/Documents/Kauki%20Digital/backend_kaukidigital/sql/schema.sql)
- *Catatan*: Backend sudah dilengkapi **auto-init**, sehingga jika tabel belum ada atau kosong, backend akan otomatis membuat tabel dan menyisipkan artikel awal secara otomatis.
