-- =======================================================
-- Kauki Digital Complete Database Schema (MySQL)
-- Version 2.0.0
-- =======================================================

CREATE DATABASE IF NOT EXISTS kauki_digital
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kauki_digital;

-- 1. Tabel Admin Users (Autentikasi & Multi-Role)
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

-- 2. Tabel Artikel & Blog CMS
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

-- 3. Tabel Inquiries / CRM Leads Masuk
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

-- 4. Tabel Layanan & Paket Harga (Dinamis dari Admin)
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

-- 5. Tabel Portofolio & Studi Kasus
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

-- 6. Tabel Pengaturan Website & CS (Site Settings)
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key   VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  description   VARCHAR(255) NULL,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
