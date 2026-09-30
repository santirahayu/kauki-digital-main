import { pool } from '../config/db.js';

// GET /api/portfolio (Public)
export async function getPortfolio(req, res) {
  try {
    const { all } = req.query;
    let sql = 'SELECT * FROM portfolio';
    if (!all) {
      sql += ' WHERE is_active = 1';
    }
    sql += ' ORDER BY order_num ASC, id ASC';

    const [rows] = await pool.query(sql);
    const formatted = rows.map(r => ({
      ...r,
      is_active: Boolean(r.is_active)
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil portofolio', error: error.message });
  }
}

// POST /api/portfolio (Admin Protected)
export async function createPortfolio(req, res) {
  try {
    const {
      title,
      category,
      image_url,
      metric,
      description,
      live_url = '#',
      is_active = true,
      order_num = 0
    } = req.body;

    if (!title || !category || !image_url || !description) {
      return res.status(400).json({ success: false, message: 'Judul, kategori, gambar, dan deskripsi wajib diisi' });
    }

    const sql = `
      INSERT INTO portfolio (title, category, image_url, metric, description, live_url, is_active, order_num)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      title.trim(),
      category.trim(),
      image_url.trim(),
      metric ? metric.trim() : null,
      description.trim(),
      live_url ? live_url.trim() : '#',
      is_active ? 1 : 0,
      Number(order_num) || 0
    ]);

    const [newRow] = await pool.query('SELECT * FROM portfolio WHERE id = ?', [result.insertId]);
    res.status(201).json({
      success: true,
      message: 'Karya portofolio berhasil ditambahkan',
      data: { ...newRow[0], is_active: Boolean(newRow[0].is_active) }
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ success: false, message: 'Gagal menambahkan portofolio', error: error.message });
  }
}

// PUT /api/portfolio/:id (Admin Protected)
export async function updatePortfolio(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      image_url,
      metric,
      description,
      live_url,
      is_active,
      order_num
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM portfolio WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan' });
    }

    const current = existing[0];
    const sql = `
      UPDATE portfolio
      SET title = ?, category = ?, image_url = ?, metric = ?, description = ?, live_url = ?, is_active = ?, order_num = ?
      WHERE id = ?
    `;

    await pool.query(sql, [
      title !== undefined ? title.trim() : current.title,
      category !== undefined ? category.trim() : current.category,
      image_url !== undefined ? image_url.trim() : current.image_url,
      metric !== undefined ? (metric ? metric.trim() : null) : current.metric,
      description !== undefined ? description.trim() : current.description,
      live_url !== undefined ? (live_url ? live_url.trim() : '#') : current.live_url,
      is_active !== undefined ? (is_active ? 1 : 0) : current.is_active,
      order_num !== undefined ? Number(order_num) : current.order_num,
      id
    ]);

    const [updated] = await pool.query('SELECT * FROM portfolio WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Portofolio berhasil diperbarui',
      data: { ...updated[0], is_active: Boolean(updated[0].is_active) }
    });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui portofolio', error: error.message });
  }
}

// DELETE /api/portfolio/:id (Admin Protected)
export async function deletePortfolio(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM portfolio WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan' });
    }
    res.json({ success: true, message: 'Portofolio berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus portofolio', error: error.message });
  }
}
