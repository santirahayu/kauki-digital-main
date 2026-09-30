import { pool } from '../config/db.js';

// GET /api/inquiries (Admin Protected)
export async function getInquiries(req, res) {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM inquiries WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data pesan/leads', error: error.message });
  }
}

// GET /api/inquiries/export-csv (Admin Protected)
export async function exportInquiriesCSV(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');

    let csv = 'ID,Tanggal,Nama,Email,Nomor HP/WA,Layanan Diminati,Budget,Status,Hosting Dibeli,Expiry Hosting,Domain Dibeli,Expiry Domain,Email Bisnis Dibeli,Expiry Email Bisnis,Pesan\n';
    const escapeCsv = value => `"${String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;

    rows.forEach(r => {
      const fields = [
        r.id,
        new Date(r.created_at).toLocaleString('id-ID'),
        r.name,
        r.email,
        r.phone,
        r.service,
        r.budget,
        r.status,
        r.hosting_purchased ? 'Ya' : 'Tidak',
        r.hosting_expires_at,
        r.domain_purchased ? 'Ya' : 'Tidak',
        r.domain_expires_at,
        r.business_email_purchased ? 'Ya' : 'Tidak',
        r.business_email_expires_at,
        r.message
      ];
      csv += `${fields.map(escapeCsv).join(',')}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=leads_kauki_digital_${Date.now()}.csv`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting inquiries CSV:', error);
    res.status(500).json({ success: false, message: 'Gagal export data CSV', error: error.message });
  }
}

// POST /api/inquiries (Public)
export async function createInquiry(req, res) {
  try {
    const {
      name,
      email,
      phone,
      service = 'Landing Page UMKM',
      budget = 'Rp750rb - Rp1.5jt',
      message
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan pesan wajib diisi' });
    }

    const sql = `
      INSERT INTO inquiries (name, email, phone, service, budget, message, status)
      VALUES (?, ?, ?, ?, ?, ?, 'new')
    `;

    const [result] = await pool.query(sql, [
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      service,
      budget,
      message.trim()
    ]);

    const [createdRows] = await pool.query('SELECT * FROM inquiries WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Pesan konsultasi berhasil terkirim. Tim kami akan segera menghubungi Anda!', data: createdRows[0] });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ success: false, message: 'Gagal mengirim pesan', error: error.message });
  }
}

// PATCH /api/inquiries/:id/status (Admin Protected)
export async function updateInquiryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'contacted', 'closed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid. Harus new, contacted, atau closed' });
    }

    const [result] = await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data inquiry tidak ditemukan' });
    }

    const [updatedRows] = await pool.query('SELECT * FROM inquiries WHERE id = ?', [id]);
    res.json({ success: true, message: 'Status berhasil diperbarui', data: updatedRows[0] });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status inquiry', error: error.message });
  }
}

// PATCH /api/inquiries/:id/services
export async function updateInquiryServices(req, res) {
  try {
    const serviceColumns = {
      hosting: {
        purchased: 'hosting_purchased',
        expiresAt: 'hosting_expires_at',
        renewalStopped: 'hosting_renewal_stopped'
      },
      domain: {
        purchased: 'domain_purchased',
        expiresAt: 'domain_expires_at',
        renewalStopped: 'domain_renewal_stopped'
      },
      business_email: {
        purchased: 'business_email_purchased',
        expiresAt: 'business_email_expires_at',
        renewalStopped: 'business_email_renewal_stopped'
      }
    };
    const columns = serviceColumns[req.body.service];
    if (!columns) {
      return res.status(400).json({ success: false, message: 'Jenis layanan tidak valid' });
    }

    const updates = [];
    const values = [];
    if (req.body.purchased !== undefined) {
      updates.push(`\`${columns.purchased}\` = ?`);
      values.push(req.body.purchased ? 1 : 0);
    }
    if (req.body.expires_at !== undefined) {
      const expiresAt = req.body.expires_at || null;
      if (expiresAt && !/^\d{4}-\d{2}-\d{2}$/.test(expiresAt)) {
        return res.status(400).json({ success: false, message: 'Format tanggal kedaluwarsa tidak valid' });
      }
      updates.push(`\`${columns.expiresAt}\` = ?`);
      values.push(expiresAt);
    }
    if (req.body.renewal_stopped !== undefined) {
      updates.push(`\`${columns.renewalStopped}\` = ?`);
      values.push(req.body.renewal_stopped ? 1 : 0);
    }
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data layanan yang diperbarui' });
    }

    const [existingRows] = await pool.query('SELECT id FROM inquiries WHERE id = ?', [req.params.id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data inquiry tidak ditemukan' });
    }

    values.push(req.params.id);
    await pool.query(`UPDATE inquiries SET ${updates.join(', ')} WHERE id = ?`, values);
    const [updatedRows] = await pool.query('SELECT * FROM inquiries WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updatedRows[0] });
  } catch (error) {
    console.error('Error updating inquiry services:', error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui layanan lead', error: error.message });
  }
}

// DELETE /api/inquiries/:id (Admin Protected)
export async function deleteInquiry(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM inquiries WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data inquiry tidak ditemukan' });
    }

    res.json({ success: true, message: 'Inquiry berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus inquiry', error: error.message });
  }
}
