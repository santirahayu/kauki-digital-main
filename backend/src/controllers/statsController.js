import { pool } from '../config/db.js';

// GET /api/stats (Admin Protected)
export async function getDashboardStats(req, res) {
  try {
    // 1. Inquiries stats
    const [inqTotal] = await pool.query('SELECT COUNT(*) as count FROM inquiries');
    const [inqNew] = await pool.query("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'");
    const [inqContacted] = await pool.query("SELECT COUNT(*) as count FROM inquiries WHERE status = 'contacted'");
    const [inqClosed] = await pool.query("SELECT COUNT(*) as count FROM inquiries WHERE status = 'closed'");

    // 2. Articles stats
    const [artTotal] = await pool.query('SELECT COUNT(*) as count, SUM(views) as total_views FROM articles');
    
    // 3. Services stats
    const [srvTotal] = await pool.query('SELECT COUNT(*) as count FROM services WHERE is_active = 1');

    // 4. Portfolio stats
    const [portTotal] = await pool.query('SELECT COUNT(*) as count FROM portfolio WHERE is_active = 1');

    // 5. Recent 5 inquiries
    const [recentInquiries] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5');

    res.json({
      success: true,
      data: {
        inquiries: {
          total: inqTotal[0].count,
          new: inqNew[0].count,
          contacted: inqContacted[0].count,
          closed: inqClosed[0].count
        },
        articles: {
          total: artTotal[0].count,
          total_views: Number(artTotal[0].total_views) || 0
        },
        services_count: srvTotal[0].count,
        portfolio_count: portTotal[0].count,
        recent_inquiries: recentInquiries
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data statistik dashboard', error: error.message });
  }
}
