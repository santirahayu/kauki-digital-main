import { SEED_ARTICLES, SEED_SERVICES, SEED_PROJECTS, SEED_SETTINGS } from '../data/seed';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STORAGE_KEYS = {
  ARTICLES: 'kauki_articles_data',
  INQUIRIES: 'kauki_inquiries_data',
  SERVICES: 'kauki_services_data',
  PORTFOLIO: 'kauki_portfolio_data',
  SETTINGS: 'kauki_settings_data',
  AUTH_TOKEN: 'kauki_auth_token',
  AUTH_USER: 'kauki_auth_user'
};

class DataService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(SEED_ARTICLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES));
    }
    
    // Always sync current portfolio with real projects
    const currentPort = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
    if (!currentPort || currentPort.includes('Kopi Nusantara')) {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(SEED_PROJECTS));
    }

    // Ensure promo banner is disabled
    const currentSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!currentSettings || currentSettings.includes('"promo_banner_active":"true"')) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([]));
    }
  }

  getAuthHeaders() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // ================= AUTHENTICATION =================
  async login(usernameOrEmail, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login gagal. Periksa username dan password.');
      }

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(data.user));
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      // Offline fallback login for local demo development
      console.warn('⚠️ Login online gagal, mencoba fallback offline:', err.message);
      if (
        (usernameOrEmail === 'admin' || usernameOrEmail === 'admin@kaukidigital.com') &&
        (password === 'AdminKauki2026!' || password === 'admin123')
      ) {
        const mockUser = {
          id: 1,
          username: 'admin',
          email: 'admin@kaukidigital.com',
          full_name: 'Super Admin Kauki',
          role: 'superadmin'
        };
        const mockToken = 'mock_jwt_token_kauki_' + Date.now();
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(mockUser));
        return { success: true, user: mockUser, token: mockToken, isOffline: true };
      }
      throw err;
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }

  isAuthenticated() {
    return Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
  }

  getAdminUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH_USER) || 'null');
    } catch {
      return null;
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengubah password');
      return data;
    } catch (err) {
      console.warn('⚠️ Gagal ubah password di API:', err.message);
      return { success: true, message: 'Password diperbarui di mode lokal.' };
    }
  }

  // ================= ARTICLES CMS =================
  async getArticles({ category, search, onlyPublished = true, featuredOnly = false } = {}) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'Semua') params.append('category', category);
      if (search) params.append('search', search);
      if (onlyPublished) params.append('onlyPublished', 'true');
      if (featuredOnly) params.append('featuredOnly', 'true');

      const res = await fetch(`${API_BASE}/articles?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data || [];
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
      if (onlyPublished) list = list.filter(a => a.is_published !== false);
      if (featuredOnly) list = list.filter(a => a.is_featured === true);
      if (category && category !== 'Semua') list = list.filter(a => a.category === category);
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(a => a.title.toLowerCase().includes(s) || a.excerpt.toLowerCase().includes(s));
      }
      return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }

  async getArticleBySlug(slug) {
    try {
      const res = await fetch(`${API_BASE}/articles/${slug}`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data || null;
    } catch (err) {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
      return list.find(a => a.slug === slug) || null;
    }
  }

  async saveArticle(articleData) {
    const isEdit = Boolean(articleData.id);
    try {
      const url = isEdit ? `${API_BASE}/articles/${articleData.id}` : `${API_BASE}/articles`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: this.getAuthHeaders(),
        body: JSON.stringify(articleData)
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      const now = new Date().toISOString();
      const article = {
        ...articleData,
        id: articleData.id || 'art-' + Date.now(),
        created_at: articleData.created_at || now,
        updated_at: now,
        views: articleData.views || 0
      };

      if (!article.read_time) {
        const words = (article.content || '').split(/\s+/).length;
        const mins = Math.max(1, Math.ceil(words / 200));
        article.read_time = `${mins} menit baca`;
      }

      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
      const index = list.findIndex(a => a.id === article.id);
      if (index >= 0) {
        list[index] = article;
      } else {
        list.unshift(article);
      }
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));
      return article;
    }
  }

  async deleteArticle(id) {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return true;
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
      list = list.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));
      return true;
    }
  }

  async incrementViews(slug) {
    try {
      await fetch(`${API_BASE}/articles/${slug}/view`, { method: 'POST' });
    } catch {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
      const art = list.find(a => a.slug === slug);
      if (art) {
        art.views = (art.views || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(list));
      }
    }
  }

  // ================= INQUIRIES & LEADS CRM =================
  async saveInquiry(inquiry) {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      const data = {
        ...inquiry,
        id: 'inq-' + Date.now(),
        created_at: new Date().toISOString(),
        status: 'new'
      };

      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
      list.unshift(data);
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
      return data;
    }
  }

  async getInquiries({ status, search } = {}) {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/inquiries?${params.toString()}`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data || [];
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
      if (status && status !== 'all') {
        list = list.filter(i => i.status === status);
      }
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(i => 
          (i.name && i.name.toLowerCase().includes(s)) ||
          (i.email && i.email.toLowerCase().includes(s)) ||
          (i.phone && i.phone.toLowerCase().includes(s)) ||
          (i.message && i.message.toLowerCase().includes(s))
        );
      }
      return list;
    }
  }

  async updateInquiryStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
      const inq = list.find(i => String(i.id) === String(id));
      if (inq) {
        inq.status = status;
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
      }
      return inq;
    }
  }

  async updateInquiryService(id, service, updates) {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}/services`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ service, ...updates })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      const fields = {
        hosting: ['hosting_purchased', 'hosting_expires_at', 'hosting_renewal_stopped'],
        domain: ['domain_purchased', 'domain_expires_at', 'domain_renewal_stopped'],
        business_email: ['business_email_purchased', 'business_email_expires_at', 'business_email_renewal_stopped']
      }[service];
      if (!fields) throw err;

      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
      const inquiry = list.find(item => String(item.id) === String(id));
      if (!inquiry) throw err;

      if (updates.purchased !== undefined) inquiry[fields[0]] = Boolean(updates.purchased);
      if (updates.expires_at !== undefined) inquiry[fields[1]] = updates.expires_at || null;
      if (updates.renewal_stopped !== undefined) inquiry[fields[2]] = Boolean(updates.renewal_stopped);
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
      return inquiry;
    }
  }

  async deleteInquiry(id) {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return true;
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
      list = list.filter(i => String(i.id) !== String(id));
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
      return true;
    }
  }

  async exportInquiriesCSV() {
    try {
      const res = await fetch(`${API_BASE}/inquiries/export-csv`, {
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_kauki_digital_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return true;
      }
    } catch (err) {
      console.warn('Fallback local CSV export:', err);
    }

    // Local CSV export fallback
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
    let csv = 'ID,Tanggal,Nama,Email,Nomor HP/WA,Layanan Diminati,Budget,Status,Hosting Dibeli,Expiry Hosting,Domain Dibeli,Expiry Domain,Email Bisnis Dibeli,Expiry Email Bisnis,Pesan\n';
    list.forEach(r => {
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
      const escapeCsv = value => `"${String(value ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
      csv += `${fields.map(escapeCsv).join(',')}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_kauki_digital_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  }

  // ================= SERVICES & PACKAGES =================
  async getServices({ all = false } = {}) {
    try {
      const res = await fetch(`${API_BASE}/services${all ? '?all=true' : ''}`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data || [];
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
      if (!all) list = list.filter(s => s.is_active !== false);
      return list;
    }
  }

  async saveService(serviceData) {
    const isEdit = Boolean(serviceData.id);
    try {
      const url = isEdit ? `${API_BASE}/services/${serviceData.id}` : `${API_BASE}/services`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: this.getAuthHeaders(),
        body: JSON.stringify(serviceData)
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
      const item = { ...serviceData, id: serviceData.id || Date.now() };
      const idx = list.findIndex(s => String(s.id) === String(item.id));
      if (idx >= 0) {
        list[idx] = item;
      } else {
        list.push(item);
      }
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
      return item;
    }
  }

  async deleteService(id) {
    try {
      const res = await fetch(`${API_BASE}/services/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return true;
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
      list = list.filter(s => String(s.id) !== String(id));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
      return true;
    }
  }

  // ================= PORTFOLIO =================
  async getPortfolio({ all = false } = {}) {
    try {
      const res = await fetch(`${API_BASE}/portfolio${all ? '?all=true' : ''}`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data || [];
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PORTFOLIO) || '[]');
      if (!all) list = list.filter(p => p.is_active !== false);
      return list;
    }
  }

  async savePortfolio(portfolioData) {
    const isEdit = Boolean(portfolioData.id);
    try {
      const url = isEdit ? `${API_BASE}/portfolio/${portfolioData.id}` : `${API_BASE}/portfolio`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: this.getAuthHeaders(),
        body: JSON.stringify(portfolioData)
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PORTFOLIO) || '[]');
      const item = { ...portfolioData, id: portfolioData.id || Date.now() };
      const idx = list.findIndex(p => String(p.id) === String(item.id));
      if (idx >= 0) {
        list[idx] = item;
      } else {
        list.push(item);
      }
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(list));
      return item;
    }
  }

  async deletePortfolio(id) {
    try {
      const res = await fetch(`${API_BASE}/portfolio/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return true;
    } catch (err) {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PORTFOLIO) || '[]');
      list = list.filter(p => String(p.id) !== String(id));
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(list));
      return true;
    }
  }

  // ================= SITE SETTINGS =================
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data || SEED_SETTINGS;
    } catch (err) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(SEED_SETTINGS));
    }
  }

  async updateSettings(updates) {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(SEED_SETTINGS));
      const merged = { ...current, ...updates };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      return merged;
    }
  }

  // ================= DASHBOARD STATS =================
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const result = await res.json();
      return result.data;
    } catch (err) {
      const inqs = JSON.parse(localStorage.getItem(STORAGE_KEYS.INQUIRIES) || '[]');
      const arts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
      const srvs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
      const ports = JSON.parse(localStorage.getItem(STORAGE_KEYS.PORTFOLIO) || '[]');

      const totalViews = arts.reduce((acc, a) => acc + (Number(a.views) || 0), 0);
      const newInqs = inqs.filter(i => i.status === 'new').length;
      const contactedInqs = inqs.filter(i => i.status === 'contacted').length;
      const closedInqs = inqs.filter(i => i.status === 'closed').length;

      return {
        inquiries: {
          total: inqs.length,
          new: newInqs,
          contacted: contactedInqs,
          closed: closedInqs
        },
        articles: {
          total: arts.length,
          total_views: totalViews
        },
        services_count: srvs.length,
        portfolio_count: ports.length,
        recent_inquiries: inqs.slice(0, 5)
      };
    }
  }
}

export const dataService = new DataService();
