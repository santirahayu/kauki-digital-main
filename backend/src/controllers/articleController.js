import { pool } from '../config/db.js';

function formatArticle(row) {
  if (!row) return null;
  let parsedTags = [];
  if (typeof row.tags === 'string') {
    try {
      parsedTags = JSON.parse(row.tags);
    } catch {
      parsedTags = row.tags.split(',').map(t => t.trim());
    }
  } else if (Array.isArray(row.tags)) {
    parsedTags = row.tags;
  }

  return {
    ...row,
    is_featured: Boolean(row.is_featured),
    is_published: Boolean(row.is_published),
    tags: parsedTags,
    views: Number(row.views || 0)
  };
}

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calculateReadTime(content) {
  const words = (content || '').trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} menit baca`;
}

// GET /api/articles
export async function getAllArticles(req, res) {
  try {
    const { category, search, onlyPublished, featuredOnly } = req.query;

    let sql = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (onlyPublished === 'true' || onlyPublished === true || onlyPublished === '1') {
      sql += ' AND is_published = 1';
    }

    if (featuredOnly === 'true' || featuredOnly === true || featuredOnly === '1') {
      sql += ' AND is_featured = 1';
    }

    if (category && category !== 'Semua') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ' AND (title LIKE ? OR excerpt LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    const formatted = rows.map(formatArticle);
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data artikel', error: error.message });
  }
}

// GET /api/articles/:slug
export async function getArticleBySlug(req, res) {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query('SELECT * FROM articles WHERE slug = ? LIMIT 1', [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }

    res.json({ success: true, data: formatArticle(rows[0]) });
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil artikel', error: error.message });
  }
}

// POST /api/articles
export async function createArticle(req, res) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category,
      author = 'Santi Rahayu',
      author_role = 'Digital Strategist',
      author_avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      read_time,
      is_featured = false,
      is_published = true,
      tags = []
    } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: 'Judul, ringkasan, dan konten wajib diisi' });
    }

    const finalSlug = slug ? generateSlug(slug) : generateSlug(title);
    const finalReadTime = read_time || calculateReadTime(content);
    const finalTags = Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify([tags]);

    const sql = `
      INSERT INTO articles 
      (title, slug, excerpt, content, cover_image, category, author, author_role, author_avatar, read_time, is_featured, is_published, views, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `;

    const [result] = await pool.query(sql, [
      title,
      finalSlug,
      excerpt,
      content,
      cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      category || 'Tips Bisnis & UMKM',
      author,
      author_role,
      author_avatar,
      finalReadTime,
      is_featured ? 1 : 0,
      is_published ? 1 : 0,
      finalTags
    ]);

    const [createdRows] = await pool.query('SELECT * FROM articles WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Artikel berhasil dibuat', data: formatArticle(createdRows[0]) });
  } catch (error) {
    console.error('Error creating article:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Slug artikel sudah terpakai, silakan gunakan slug lain' });
    }
    res.status(500).json({ success: false, message: 'Gagal membuat artikel', error: error.message });
  }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      category,
      author,
      author_role,
      author_avatar,
      read_time,
      is_featured,
      is_published,
      tags
    } = req.body;

    const [existing] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }

    const current = existing[0];
    const finalTitle = title !== undefined ? title : current.title;
    const finalSlug = slug !== undefined ? generateSlug(slug) : current.slug;
    const finalContent = content !== undefined ? content : current.content;
    const finalExcerpt = excerpt !== undefined ? excerpt : current.excerpt;
    const finalCover = cover_image !== undefined ? cover_image : current.cover_image;
    const finalCategory = category !== undefined ? category : current.category;
    const finalAuthor = author !== undefined ? author : current.author;
    const finalRole = author_role !== undefined ? author_role : current.author_role;
    const finalAvatar = author_avatar !== undefined ? author_avatar : current.author_avatar;
    const finalReadTime = read_time !== undefined ? read_time : (content ? calculateReadTime(content) : current.read_time);
    const finalFeatured = is_featured !== undefined ? (is_featured ? 1 : 0) : current.is_featured;
    const finalPublished = is_published !== undefined ? (is_published ? 1 : 0) : current.is_published;
    
    let finalTags = current.tags;
    if (tags !== undefined) {
      finalTags = Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify([tags]);
    }

    const sql = `
      UPDATE articles 
      SET title = ?, slug = ?, excerpt = ?, content = ?, cover_image = ?, category = ?, 
          author = ?, author_role = ?, author_avatar = ?, read_time = ?, 
          is_featured = ?, is_published = ?, tags = ?
      WHERE id = ?
    `;

    await pool.query(sql, [
      finalTitle,
      finalSlug,
      finalExcerpt,
      finalContent,
      finalCover,
      finalCategory,
      finalAuthor,
      finalRole,
      finalAvatar,
      finalReadTime,
      finalFeatured,
      finalPublished,
      finalTags,
      id
    ]);

    const [updatedRows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    res.json({ success: true, message: 'Artikel berhasil diperbarui', data: formatArticle(updatedRows[0]) });
  } catch (error) {
    console.error('Error updating article:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Slug artikel sudah terpakai oleh artikel lain' });
    }
    res.status(500).json({ success: false, message: 'Gagal memperbarui artikel', error: error.message });
  }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }

    res.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus artikel', error: error.message });
  }
}

// POST /api/articles/:slug/view
export async function incrementViews(req, res) {
  try {
    const { slug } = req.params;
    await pool.query('UPDATE articles SET views = views + 1 WHERE slug = ?', [slug]);
    const [rows] = await pool.query('SELECT views FROM articles WHERE slug = ?', [slug]);
    const views = rows.length > 0 ? rows[0].views : 0;
    res.json({ success: true, views });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ success: false, message: 'Gagal menambah view artikel', error: error.message });
  }
}
