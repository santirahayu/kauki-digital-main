import { pool } from '../config/db.js';

// GET /api/settings (Public)
export async function getSettings(req, res) {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value, description FROM site_settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });

    res.json({ success: true, data: settings, raw: rows });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil pengaturan website', error: error.message });
  }
}

// PUT /api/settings (Admin Protected)
export async function updateSettings(req, res) {
  try {
    const updates = req.body; // e.g. { whatsapp_number: '628123...', promo_banner_active: 'false' }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Data update tidak valid' });
    }

    for (const [key, value] of Object.entries(updates)) {
      const stringValue = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
      await pool.query(
        `INSERT INTO site_settings (setting_key, setting_value) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, stringValue, stringValue]
      );
    }

    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });

    res.json({
      success: true,
      message: 'Pengaturan website berhasil disimpan',
      data: settings
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan pengaturan', error: error.message });
  }
}
