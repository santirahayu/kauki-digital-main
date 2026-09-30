# Backend Kauki Digital (Node.js + Express + MySQL)

REST API Backend untuk website **Kauki Digital**, mengelola data artikel wawasan bisnis dan leads inquiry klien dengan integrasi database MySQL.

---

## 🚀 Fitur Utama
1. **Database Auto-Init & Seeding**: Otomatis membuat database `kauki_digital`, tabel `articles`, tabel `inquiries`, dan menyisipkan artikel awal saat server dijalankan pertama kali.
2. **Koneksi MySQL Pool (mysql2/promise)**: Koneksi pool yang cepat, aman dengan parameterized query (anti-SQL Injection), dan mendukung karakter UTF-8 (`utf8mb4`).
3. **RESTful API Lengkap**:
   - `GET /api/health` - Cek status server backend
   - `GET /api/articles` - Mengambil daftar artikel (mendukung filter kategori, pencarian, status publish & featured)
   - `GET /api/articles/:slug` - Mengambil detail artikel berdasarkan slug
   - `POST /api/articles` - Membuat artikel baru
   - `PUT /api/articles/:id` - Memperbarui artikel
   - `DELETE /api/articles/:id` - Menghapus artikel
   - `POST /api/articles/:slug/view` - Menambah jumlah views artikel
   - `GET /api/inquiries` - Mengambil data formulir pesan / leads dari klien
   - `POST /api/inquiries` - Menyimpan pesan baru dari formulir kontak
   - `PATCH /api/inquiries/:id/status` - Update status pesan (`new`, `contacted`, `closed`)
   - `DELETE /api/inquiries/:id` - Menghapus pesan inquiry

---

## 🛠️ Konfigurasi `.env`

File konfigurasi berada di `backend_kaukidigital/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kauki_digital
```

> **Catatan**: Sesuaikan `DB_USER` dan `DB_PASSWORD` dengan konfigurasi MySQL / XAMPP / DBeaver Anda. Jika menggunakan password di MySQL (misal `root` atau `password123`), masukkan nilainya pada `DB_PASSWORD`.

---

## 💻 Cara Menjalankan Backend

1. Masuk ke folder backend:
   ```bash
   cd "c:\Users\Lenovo\Documents\Kauki Digital\backend_kaukidigital"
   ```

2. Jalankan server:
   ```bash
   # Mode Development (auto-reload saat ada perubahan file)
   npm run dev
   # atau
   pnpm run dev

   # Mode Production
   npm start
   # atau
   pnpm start
   ```

3. Server akan berjalan di: **`http://localhost:5000`**
