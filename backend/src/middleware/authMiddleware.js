import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'kauki_digital_jwt_secret_token_2026_secure';

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded; // { id, username, email, role }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Sesi login telah kedaluwarsa atau tidak valid. Silakan login kembali.',
      error: error.message
    });
  }
}
