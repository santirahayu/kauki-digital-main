import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kauki_digital',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

export const pool = mysql.createPool(dbConfig);

export async function initDatabase() {
  let serverConn;
  try {
    // 1. Check server connection (without db selected) to ensure database exists
    serverConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await serverConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await serverConn.end();

    // 2. Pool connection to database
    const dbConn = await pool.getConnection();

    // 3. Admin Users Table
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
        username      VARCHAR(100) NOT NULL,
        email         VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name     VARCHAR(150) NOT NULL DEFAULT 'Admin Kauki Digital',
        role          ENUM('superadmin', 'cs', 'editor') NOT NULL DEFAULT 'superadmin',
        created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_admin_username (username),
        UNIQUE KEY uq_admin_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Articles Table
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title         VARCHAR(255) NOT NULL,
        slug          VARCHAR(255) NOT NULL,
        excerpt       TEXT NOT NULL,
        content       MEDIUMTEXT NOT NULL,
        cover_image   VARCHAR(1000) NOT NULL,
        category      VARCHAR(100) NOT NULL,
        author        VARCHAR(100) NOT NULL DEFAULT 'Tim Kauki Digital',
        author_role   VARCHAR(150) NULL,
        author_avatar VARCHAR(1000) NULL,
        read_time     VARCHAR(50) NULL,
        is_featured   TINYINT(1) NOT NULL DEFAULT 0,
        is_published  TINYINT(1) NOT NULL DEFAULT 1,
        views         INT UNSIGNED NOT NULL DEFAULT 0,
        tags          JSON NULL,
        created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uq_articles_slug (slug),
        KEY idx_articles_list (is_published, created_at),
        KEY idx_articles_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Inquiries / Leads Table
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(255) NOT NULL,
        phone      VARCHAR(30) NULL,
        service    VARCHAR(150) NULL,
        budget     VARCHAR(100) NULL,
        message    TEXT NOT NULL,
        hosting_purchased TINYINT(1) NOT NULL DEFAULT 0,
        hosting_expires_at DATE NULL,
        hosting_renewal_stopped TINYINT(1) NOT NULL DEFAULT 0,
        domain_purchased TINYINT(1) NOT NULL DEFAULT 0,
        domain_expires_at DATE NULL,
        domain_renewal_stopped TINYINT(1) NOT NULL DEFAULT 0,
        business_email_purchased TINYINT(1) NOT NULL DEFAULT 0,
        business_email_expires_at DATE NULL,
        business_email_renewal_stopped TINYINT(1) NOT NULL DEFAULT 0,
        status     ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_inquiries_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const inquiryServiceColumns = [
      ['hosting_purchased', 'TINYINT(1) NOT NULL DEFAULT 0'],
      ['hosting_expires_at', 'DATE NULL'],
      ['hosting_renewal_stopped', 'TINYINT(1) NOT NULL DEFAULT 0'],
      ['domain_purchased', 'TINYINT(1) NOT NULL DEFAULT 0'],
      ['domain_expires_at', 'DATE NULL'],
      ['domain_renewal_stopped', 'TINYINT(1) NOT NULL DEFAULT 0'],
      ['business_email_purchased', 'TINYINT(1) NOT NULL DEFAULT 0'],
      ['business_email_expires_at', 'DATE NULL'],
      ['business_email_renewal_stopped', 'TINYINT(1) NOT NULL DEFAULT 0']
    ];

    for (const [column, definition] of inquiryServiceColumns) {
      const [existingColumns] = await dbConn.query('SHOW COLUMNS FROM inquiries LIKE ?', [column]);
      if (existingColumns.length === 0) {
        await dbConn.query(`ALTER TABLE inquiries ADD COLUMN \`${column}\` ${definition}`);
      }
    }

    // 6. Services & Pricing Packages Table
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title       VARCHAR(255) NOT NULL,
        badge       VARCHAR(100) NULL,
        category    VARCHAR(100) NOT NULL DEFAULT 'Website',
        icon_name   VARCHAR(50) NOT NULL DEFAULT 'Globe',
        price       VARCHAR(100) NOT NULL,
        price_note  VARCHAR(255) NULL,
        description TEXT NOT NULL,
        features    JSON NOT NULL,
        cta_text    VARCHAR(100) NOT NULL DEFAULT 'Pesan Sekarang',
        cta_link    VARCHAR(500) NULL,
        is_popular  TINYINT(1) NOT NULL DEFAULT 0,
        is_active   TINYINT(1) NOT NULL DEFAULT 1,
        order_num   INT NOT NULL DEFAULT 0,
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Portfolio Table
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        title       VARCHAR(255) NOT NULL,
        category    VARCHAR(100) NOT NULL,
        image_url   VARCHAR(1000) NOT NULL,
        metric      VARCHAR(100) NULL,
        description TEXT NOT NULL,
        live_url    VARCHAR(500) NULL,
        is_active   TINYINT(1) NOT NULL DEFAULT 1,
        order_num   INT NOT NULL DEFAULT 0,
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. Site Settings Table
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key   VARCHAR(100) NOT NULL,
        setting_value TEXT NOT NULL,
        description   VARCHAR(255) NULL,
        updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (setting_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // --- SEED DEFAULT DATA ---

    // A. Seed Admin User
    const [adminRows] = await dbConn.query('SELECT COUNT(*) as count FROM admin_users');
    if (adminRows[0].count === 0) {
      console.log('🔑 Seeding default superadmin account...');
      const defaultPassword = 'AdminKauki2026!';
      const hash = await bcrypt.hash(defaultPassword, 10);
      await dbConn.query(`
        INSERT INTO admin_users (username, email, password_hash, full_name, role)
        VALUES (?, ?, ?, ?, ?)
      `, ['admin', 'admin@kaukidigital.com', hash, 'Super Admin Kauki', 'superadmin']);
      console.log('✅ Default superadmin account created (username: admin / email: admin@kaukidigital.com).');
    }

    // B. Seed Site Settings
    const [settingRows] = await dbConn.query('SELECT COUNT(*) as count FROM site_settings');
    if (settingRows[0].count === 0) {
      console.log('⚙️ Seeding default site settings...');
      const defaultSettings = [
        ['whatsapp_number', '6283835782376', 'Nomor WhatsApp Utama CS'],
        ['whatsapp_cs_name', 'CS Kauki Digital', 'Nama Kontak CS WhatsApp'],
        ['email_contact', 'halo@kaukidigital.com', 'Alamat Email Resmi Kontak'],
        ['office_address', 'Bandung Digital Valley / Jakarta Hub, Indonesia', 'Alamat Kantor / Operasional'],
        ['promo_banner_active', 'false', 'Status Banner Promo di Atas Web'],
        ['promo_banner_text', '', 'Teks Promo Bar Atas'],
        ['instagram_url', 'https://instagram.com/kaukidigital', 'Link Akun Instagram'],
        ['operating_hours', 'Senin - Sabtu: 08:00 - 21:00 WIB', 'Jam Layanan & Respon CS']
      ];
      for (const st of defaultSettings) {
        await dbConn.query(`
          INSERT INTO site_settings (setting_key, setting_value, description)
          VALUES (?, ?, ?)
        `, st);
      }
    } else {
      // Ensure promo_banner_active is disabled by default
      await dbConn.query(`UPDATE site_settings SET setting_value = 'false' WHERE setting_key = 'promo_banner_active'`);
    }

    // C. Seed Services
    const [serviceRows] = await dbConn.query('SELECT COUNT(*) as count FROM services');
    if (serviceRows[0].count === 0) {
      console.log('💼 Seeding default services & pricing packages...');
      const defaultServices = [
        [
          'Landing Page UMKM',
          'Hemat & Cepat',
          'Website',
          'Globe',
          'Rp750.000',
          'Sekali bayar • Tanpa biaya bulanan',
          'Desain simpel, cepat, dan persuasif untuk mempromosikan 1 produk atau promo khusus.',
          JSON.stringify([
            '1 Halaman Responsif Mobile & Desktop',
            'Tombol Direct Chat WhatsApp',
            'Copywriting & Gambar Dibantu Tim Kami',
            'Kecepatan Loading di Bawah 1.5s',
            'Garansi Pengerjaan 3-5 Hari Jadi'
          ]),
          'Pilih Paket Ini',
          'https://wa.me/6283835782376?text=Halo%20Kauki%20Digital,%20saya%20tertarik%20Paket%20Landing%20Page',
          0,
          1,
          1
        ],
        [
          'Company Profile Profesional',
          'Paling Populer',
          'Website',
          'Building',
          'Rp1.500.000',
          'Lengkap dengan Domain & Email Bisnis',
          'Membangun reputasi kelas atas untuk klinik, konsultan, sekolah, dan perusahaan.',
          JSON.stringify([
            '3-5 Halaman Multi-page Lengkap',
            'Gratis Domain .com / .id 1 Tahun',
            '5 Akun Email Bisnis Resmi',
            'Integrasi Form Leads & Google Maps',
            'Fondasi SEO Google Indexing Cepat'
          ]),
          'Pesan Sekarang',
          'https://wa.me/6283835782376?text=Halo%20Kauki%20Digital,%20saya%20tertarik%20Paket%20Company%20Profile',
          1,
          1,
          2
        ],
        [
          'Email Bisnis Pro',
          'Kredibilitas Klien',
          'Email',
          'Mail',
          'Rp69.000',
          '/user/bulan • Multi-device sync',
          'Beralih dari @gmail ke nama@bisnismu.com untuk reputasi profesional saat kirim proposal.',
          JSON.stringify([
            'Alamat Email Kustom (sales@brand.com)',
            'Proteksi Enkripsi & Anti-Spam Tinggi',
            'Sinkronisasi ke Gmail / iPhone / Outlook',
            'Setup DNS, SPF, DKIM Dibereskan Tim Kami'
          ]),
          'Daftar Email Bisnis',
          'https://wa.me/6283835782376?text=Halo%20Kauki%20Digital,%20saya%20mau%20daftar%20Email%20Bisnis',
          0,
          1,
          3
        ]
      ];
      for (const s of defaultServices) {
        await dbConn.query(`
          INSERT INTO services (title, badge, category, icon_name, price, price_note, description, features, cta_text, cta_link, is_popular, is_active, order_num)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, s);
      }
    }

    // D. Seed Portfolio (Real Projects)
    await dbConn.query('DELETE FROM portfolio');
    console.log('🎨 Seeding real portfolio projects (KAP Ida Nurhayati & Valens Advisory)...');
    const defaultProjects = [
      [
        'KAP Ida Nurhayati',
        'Kantor Akuntan Publik & Audit',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
        'Audited & Registered RPA',
        'Website resmi Kantor Akuntan Publik terdaftar di Semarang dengan profil layanan audit assurance, perpajakan, pembukuan, dan sistem informasi akuntansi.',
        'https://kap-kantor-akuntan-publik.vercel.app/',
        1,
        1
      ],
      [
        'Valens Advisory',
        'Strategic Tax & Financial Advisory',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
        'Strategic Tax & Law Firm',
        'Website premium firma konsultan pajak, kepastian hukum, dan strategi keuangan korporasi dengan estetika visual mewah emerald-gold dan integrasi leads.',
        'https://projek-sampingan-ten.vercel.app/',
        1,
        2
      ]
    ];
    for (const p of defaultProjects) {
      await dbConn.query(`
        INSERT INTO portfolio (title, category, image_url, metric, description, live_url, is_active, order_num)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, p);
    }

    // E. Seed Articles
    const [existing] = await dbConn.query('SELECT COUNT(*) as count FROM articles');
    if (existing[0].count === 0) {
      console.log('🌱 Seeding default articles into MySQL database...');
      const seedArticles = [
        [
          '7 Alasan Kenapa Bisnis UMKM Wajib Punya Website Sendiri di 2026',
          '7-alasan-umkm-wajib-punya-website-2026',
          'Di era digital saat ini, mengandalkan media sosial saja tidak cukup. Pelajari bagaimana website profesional bisa meningkatkan kepercayaan dan melipatgandakan omzet bisnis Anda.',
          '## Kenapa Media Sosial Saja Tidak Cukup?\n\nBanyak pemilik bisnis merasa sudah cukup hanya dengan akun Instagram atau TikTok. Namun, fakta di lapangan menunjukkan bahwa **84% konsumen Indonesia lebih mempercayai bisnis yang memiliki website resmi**.\n\n> "Website adalah kantor digital Anda yang buka 24 jam sehari, 7 hari seminggu tanpa henti."\n\n### 1. Kredibilitas Instan di Mata Calon Klien\nSaat calon pembeli ingin melakukan transaksi bernilai besar, hal pertama yang mereka cari di Google adalah website resmi Anda. Jika tidak ditemukan, tingkat keraguan pembeli akan melonjak drastis.\n\n### 2. Kepemilikan Penuh Tanpa Tergantung Algoritma\nAlgoritma media sosial terus berubah. Akun bisa terkena suspend kapan saja. Dengan website, Anda memiliki kontrol 100% atas audiens, data pelanggan, dan katalog produk Anda.\n\n### 3. Tampil di Pencarian Google (SEO Lokal)\nDengan website yang dioptimasi untuk SEO lokal, bisnis Anda akan otomatis muncul saat calon pelanggan di kota Anda mencari *"Jasa Konsultan Jakarta"*, *"Salon Terbaik Bandung"*, atau *"Toko Bahan Bangunan Surabaya"*.\n\n### 4. Otomatisasi Penjualan & Leads\nIntegrasikan tombol WhatsApp langsung, formulir pemesanan, atau kalkulator harga yang membuat pelanggan bisa langsung menghubungi Anda dengan data pesanan yang jelas.\n\n---\n\n## Kesimpulan: Mulai Langkah Pertama Anda Bersama Kauki Digital\nMembuat website tidak harus mahal dan rumit. Di **Kauki Digital**, kami merancang website siap pakai, cepat, dan mobile-friendly dengan harga yang sangat bersahabat untuk UMKM.',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          'Tips Bisnis & UMKM',
          'Rian Prasetyo',
          'Lead Web Strategist',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          '4 menit baca',
          1,
          1,
          1420,
          JSON.stringify(['Website', 'UMKM', 'Strategi Bisnis', 'Digital Marketing']),
          '2026-03-10 10:00:00'
        ],
        [
          'Panduan Memilih Email Bisnis (nama@bisnismu.com) vs Gmail Biasa',
          'panduan-email-bisnis-profesional-vs-gmail',
          'Ketahui bagaimana menggunakan email berdomain bisnis sendiri dapat melipatgandakan tingkat closing proposal dan mencegah email penawaran Anda masuk folder spam.',
          '## Kesan Pertama Sangat Menentukan\n\nKetika Anda mengirimkan penawaran kerja sama senilai jutaan rupiah menggunakan alamat email gratisan seperti `tokomaju99@gmail.com`, calon klien korporat atau partner bisnis seringkali merasa ragu.\n\nBandingkan dengan mengirim penawaran dari `sales@tokomaju.com` atau `budi@tokomaju.id`.\n\n### Mengapa Email Bisnis Sangat Krusial?\n\n1. **Anti-Phishing & Anti-Spam**: Email berdomain sendiri memiliki sertifikat SPF, DKIM, dan DMARC yang membuat email Anda 99% pasti masuk Inbox utama, bukan folder Spam.\n2. **Kontrol Akses Karyawan**: Jika ada karyawan yang resign, Anda dapat dengan mudah mengalihkan atau mencabut akses inbox tanpa takut kehilangan data klien.\n3. **Membangun Brand Recognition**: Setiap kali Anda mengirim email atau invoice, nama brand bisnis Anda selalu terbaca oleh penerima.\n\n```\nPerbandingan Tingkat Konversi Proposal:\n- Email Gratisan (@gmail/@yahoo): 18% respon rate\n- Email Bisnis Kustom (@brand.com): 58% respon rate (+220% peningkatan)\n```\n\nKauki Digital menyediakan paket **Email Bisnis Siap Pakai** dengan sinkronisasi mudah ke smartphone Android, iPhone, dan Outlook.',
          'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=1200&q=80',
          'Domain & Email Bisnis',
          'Amanda Putri',
          'Cloud Infrastructure Specialist',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
          '5 menit baca',
          0,
          1,
          980,
          JSON.stringify(['Email Bisnis', 'Domain', 'Kredibilitas', 'Branding']),
          '2026-03-05 14:30:00'
        ],
        [
          'Studi Kasus: Bagaimana Klinik Kecantikan Naik 280% Pasien Baru Lewat Landing Page',
          'studi-kasus-klinik-kecantikan-naik-280-persen',
          'Bedah tuntas strategi pembuatan landing page cepat, mobile responsive, dan terintegrasi tombol WhatsApp booking otomatis untuk klinik kecantikan.',
          '## Tantangan Klien\nKlinik dr. Clara sebelumnya hanya mengandalkan postingan media sosial dan brosur fisik. Biaya iklan terus naik, namun konversi chat WhatsApp sangat rendah karena calon pasien bingung melihat daftar harga dan menu perawatan.\n\n## Solusi dari Kauki Digital\nKami merancang **High-Converting Landing Page** dengan pendekatan:\n- **Loading Speed di Bawah 1.2 Detik**: Memastikan pengunjung HP tidak kabur karena loading lama.\n- **Daftar Treatment Interaktif**: Dilengkapi foto before-after yang estetik dan testimoni verified.\n- **Smart WhatsApp Booking Button**: Pesan WhatsApp langsung terisi: *"Halo dok, saya ingin booking Treatment Glow Facial untuk hari Sabtu..."*\n\n## Hasil Setelah 30 Hari:\n- **Peningkatan Chat WhatsApp**: +280%\n- **Bounce Rate Menurun**: dari 68% ke 21%\n- **ROI Iklan**: Meningkat 3.4x lipat',
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
          'Website & Desain',
          'Fajar Wicaksono',
          'UI/UX & Conversion Architect',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          '6 menit baca',
          0,
          1,
          2150,
          JSON.stringify(['Studi Kasus', 'Landing Page', 'Konversi', 'Klinik & Salon']),
          '2026-02-28 09:15:00'
        ],
        [
          'Cara Optimasi SEO Website Agar Masuk Halaman 1 Google Tanpa Iklan Mahal',
          'cara-optimasi-seo-halaman-1-google-tanpa-iklan',
          'Strategi SEO praktis untuk bisnis lokal: riset kata kunci potensial, optimasi kecepatan, dan pembuatan artikel blog yang disukai mesin pencari.',
          '## Apa Itu SEO dan Mengapa Anda Menyukainya?\nSEO (Search Engine Optimization) adalah cara agar website Anda ditemukan oleh orang-orang yang memang **sedang mencari** produk Anda di Google secara gratis (organik).\n\n### 3 Pilar Utama SEO Modern:\n1. **Kecepatan & Responsivitas Mobile**: Google memprioritaskan website yang ringan di HP.\n2. **Konten Relevan & Berkualitas**: Menjawab pertanyaan spesifik pelanggan secara tuntas.\n3. **Struktur Teknis yang Bersih**: Tag Heading (H1, H2, H3), Meta Tag, dan Schema Markup yang rapi.\n\nDi Kauki Digital, setiap website yang kami kembangkan sudah dilengkapi dengan fondasi SEO terbaik sejak hari pertama!',
          'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
          'SEO & Digital Marketing',
          'Rian Prasetyo',
          'Lead Web Strategist',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          '4 menit baca',
          0,
          1,
          1120,
          JSON.stringify(['SEO', 'Google Search', 'Organic Traffic']),
          '2026-02-20 16:00:00'
        ]
      ];

      for (const art of seedArticles) {
        await dbConn.query(
          `INSERT INTO articles 
          (title, slug, excerpt, content, cover_image, category, author, author_role, author_avatar, read_time, is_featured, is_published, views, tags, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          art
        );
      }
      console.log('✅ Seed articles inserted successfully.');
    }

    dbConn.release();
    console.log(`✅ MySQL connected & schema validated successfully on database "${dbConfig.database}".`);
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('👉 Tip: Silakan periksa user dan password MySQL di file backend_kaukidigital/.env');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('👉 Tip: Pastikan MySQL Server (XAMPP / MySQL Service / DBeaver) sudah running di port 3306');
    }
  }
}
