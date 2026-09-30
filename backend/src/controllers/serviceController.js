import { pool } from '../config/db.js';

// GET /api/services (Public)
export async function getServices(req, res) {
  try {
    const { all } = req.query;
    let sql = 'SELECT * FROM services';
    if (!all) {
      sql += ' WHERE is_active = 1';
    }
    sql += ' ORDER BY order_num ASC, id ASC';

    const [rows] = await pool.query(sql);

    // Format JSON features if returned as string
    const formatted = rows.map(r => ({
      ...r,
      features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features,
      is_popular: Boolean(r.is_popular),
      is_active: Boolean(r.is_active)
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data layanan', error: error.message });
  }
}

// POST /api/services (Admin Protected)
export async function createService(req, res) {
  try {
    const {
      title,
      badge,
      category = 'Website',
      icon_name = 'Globe',
      price,
      price_note,
      description,
      features = [],
      cta_text = 'Pesan Sekarang',
      cta_link,
      is_popular = false,
      is_active = true,
      order_num = 0
    } = req.body;

    if (!title || !price || !description) {
      return res.status(400).json({ success: false, message: 'Judul, harga, dan deskripsi wajib diisi' });
    }

    const jsonFeatures = Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([features]);

    const sql = `
      INSERT INTO services (title, badge, category, icon_name, price, price_note, description, features, cta_text, cta_link, is_popular, is_active, order_num)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      title.trim(),
      badge ? badge.trim() : null,
      category.trim(),
      icon_name,
      price.trim(),
      price_note ? price_note.trim() : null,
      description.trim(),
      jsonFeatures,
      cta_text.trim(),
      cta_link ? cta_link.trim() : null,
      is_popular ? 1 : 0,
      is_active ? 1 : 0,
      Number(order_num) || 0
    ]);

    const [newRow] = await pool.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    const service = {
      ...newRow[0],
      features: typeof newRow[0].features === 'string' ? JSON.parse(newRow[0].features) : newRow[0].features,
      is_popular: Boolean(newRow[0].is_popular),
      is_active: Boolean(newRow[0].is_active)
    };

    res.status(201).json({ success: true, message: 'Paket layanan berhasil ditambahkan', data: service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan layanan', error: error.message });
  }
}

// PUT /api/services/:id (Admin Protected)
export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      badge,
      category,
      icon_name,
      price,
      price_note,
      description,
      features,
      cta_text,
      cta_link,
      is_popular,
      is_active,
      order_num
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Paket layanan tidak ditemukan' });
    }

    const current = existing[0];
    const jsonFeatures = features !== undefined 
      ? (Array.isArray(features) ? JSON.stringify(features) : JSON.stringify([features]))
      : current.features;

    const sql = `
      UPDATE services 
      SET title = ?, badge = ?, category = ?, icon_name = ?, price = ?, price_note = ?, description = ?, features = ?, cta_text = ?, cta_link = ?, is_popular = ?, is_active = ?, order_num = ?
      WHERE id = ?
    `;

    await pool.query(sql, [
      title !== undefined ? title.trim() : current.title,
      badge !== undefined ? (badge ? badge.trim() : null) : current.badge,
      category !== undefined ? category.trim() : current.category,
      icon_name !== undefined ? icon_name : current.icon_name,
      price !== undefined ? price.trim() : current.price,
      price_note !== undefined ? (price_note ? price_note.trim() : null) : current.price_note,
      description !== undefined ? description.trim() : current.description,
      jsonFeatures,
      cta_text !== undefined ? cta_text.trim() : current.cta_text,
      cta_link !== undefined ? (cta_link ? cta_link.trim() : null) : current.cta_link,
      is_popular !== undefined ? (is_popular ? 1 : 0) : current.is_popular,
      is_active !== undefined ? (is_active ? 1 : 0) : current.is_active,
      order_num !== undefined ? Number(order_num) : current.order_num,
      id
    ]);

    const [updated] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
    const service = {
      ...updated[0],
      features: typeof updated[0].features === 'string' ? JSON.parse(updated[0].features) : updated[0].features,
      is_popular: Boolean(updated[0].is_popular),
      is_active: Boolean(updated[0].is_active)
    };

    res.json({ success: true, message: 'Paket layanan berhasil diperbarui', data: service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui layanan', error: error.message });
  }
}

// DELETE /api/services/:id (Admin Protected)
export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM services WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Layanan tidak ditemukan' });
    }
    res.json({ success: true, message: 'Paket layanan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus layanan', error: error.message });
  }
}
