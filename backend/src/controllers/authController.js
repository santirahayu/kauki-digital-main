import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'kauki_digital_jwt_secret_token_2026_secure';

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email dan Password wajib diisi'
      });
    }

    const [rows] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1',
      [usernameOrEmail.trim(), usernameOrEmail.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Akun admin tidak ditemukan. Periksa kembali username/email Anda.'
      });
    }

    const admin = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password yang Anda masukkan salah.'
      });
    }

    // Sign JWT
    const tokenPayload = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      full_name: admin.full_name
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login berhasil! Selamat datang kembali.',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memproses login',
      error: error.message
    });
  }
}

// GET /api/auth/me
export async function getMe(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, full_name, role, created_at, updated_at FROM admin_users WHERE id = ?',
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data admin tidak ditemukan' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil profil admin', error: error.message });
  }
}

// POST /api/auth/change-password
export async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan password baru wajib diisi'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal harus 6 karakter'
      });
    }

    const [rows] = await pool.query('SELECT * FROM admin_users WHERE id = ?', [req.admin.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User admin tidak ditemukan' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(oldPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Password lama salah. Silakan coba lagi.'
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [newHash, req.admin.id]);

    res.json({
      success: true,
      message: 'Password berhasil diubah. Silakan gunakan password baru Anda untuk login selanjutnya.'
    });
  } catch (error) {
    console.error('Error changing admin password:', error);
    res.status(500).json({ success: false, message: 'Gagal mengubah password', error: error.message });
  }
}

// PUT /api/auth/profile
export async function updateProfile(req, res) {
  try {
    const { full_name, email } = req.body;
    if (!full_name || !email) {
      return res.status(400).json({ success: false, message: 'Nama lengkap dan email wajib diisi' });
    }

    await pool.query(
      'UPDATE admin_users SET full_name = ?, email = ? WHERE id = ?',
      [full_name.trim(), email.trim().toLowerCase(), req.admin.id]
    );

    const [updated] = await pool.query(
      'SELECT id, username, email, full_name, role FROM admin_users WHERE id = ?',
      [req.admin.id]
    );

    res.json({
      success: true,
      message: 'Profil admin berhasil diperbarui',
      user: updated[0]
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil', error: error.message });
  }
}
