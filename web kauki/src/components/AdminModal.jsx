import React, { useState, useEffect } from 'react';
import { dataService } from '../lib/storage';
import { marked } from 'marked';
import { 
  Shield, 
  Plus, 
  LayoutDashboard, 
  FileText, 
  Inbox, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  Sparkles, 
  MessageSquare,
  X,
  Lock,
  LogOut,
  Settings,
  Briefcase,
  Layers,
  Download,
  Search,
  ExternalLink,
  TrendingUp,
  Phone,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  KeyRound,
  EyeOff
} from 'lucide-react';

const INQUIRY_SERVICES = [
  { key: 'hosting', label: 'Hosting', purchasedField: 'hosting_purchased', expiryField: 'hosting_expires_at', stoppedField: 'hosting_renewal_stopped' },
  { key: 'domain', label: 'Domain', purchasedField: 'domain_purchased', expiryField: 'domain_expires_at', stoppedField: 'domain_renewal_stopped' },
  { key: 'business_email', label: 'Email Bisnis', purchasedField: 'business_email_purchased', expiryField: 'business_email_expires_at', stoppedField: 'business_email_renewal_stopped' }
];

const formatDateInput = (value) => value ? String(value).slice(0, 10) : '';

const getDaysUntilExpiry = (dateValue) => {
  const expiryDate = new Date(`${formatDateInput(dateValue)}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
};

export default function AdminModal({ isOpen, onClose, onDataChange }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Tabs: 'dashboard', 'inquiries', 'articles', 'services', 'portfolio', 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    whatsapp_number: '6283835782376',
    whatsapp_cs_name: 'CS Kauki Digital',
    email_contact: 'halo@kaukidigital.com',
    office_address: 'Bandung Digital Valley / Jakarta Hub, Indonesia',
    promo_banner_active: 'true',
    promo_banner_text: '🔥 Promo Spesial: Diskon 20% Pembuatan Website + Gratis Email Bisnis 1 Tahun!',
    instagram_url: 'https://instagram.com/kaukidigital',
    operating_hours: 'Senin - Sabtu: 08:00 - 21:00 WIB'
  });

  // Filter & Search states
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryView, setInquiryView] = useState('leads');
  const [serviceDrafts, setServiceDrafts] = useState({});
  const [renewalDateDrafts, setRenewalDateDrafts] = useState({});
  const [savingServiceKey, setSavingServiceKey] = useState(null);
  const [articleSearch, setArticleSearch] = useState('');
  const [articleCategory, setArticleCategory] = useState('Semua');

  // Sub-modals
  const [articleEditorOpen, setArticleEditorOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    slug: '',
    category: 'Tips Bisnis & UMKM',
    excerpt: '',
    content: '',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    author: 'Santi Rahayu',
    author_role: 'Lead Web Strategist',
    is_published: true,
    is_featured: false,
    tags: 'Website, UMKM'
  });
  const [articlePreviewMode, setArticlePreviewMode] = useState(false);

  // Service Sub-modal
  const [serviceEditorOpen, setServiceEditorOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    badge: '',
    category: 'Website',
    price: '',
    price_note: '',
    description: '',
    featuresText: '',
    cta_text: 'Pesan Sekarang',
    cta_link: '',
    is_popular: false,
    is_active: true
  });

  // Portfolio Sub-modal
  const [portfolioEditorOpen, setPortfolioEditorOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const [portfolioFormData, setPortfolioFormData] = useState({
    title: '',
    category: 'Toko Online & F&B',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    metric: '+300% Penjualan',
    description: '',
    live_url: '#',
    is_active: true
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (dataService.isAuthenticated()) {
        setIsAuthenticated(true);
        setCurrentUser(dataService.getAdminUser() || { username: 'admin', full_name: 'Super Admin Kauki', role: 'superadmin' });
        loadAllData();
      }
    }
  }, [isOpen]);

  const showToastMsg = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAllData = async () => {
    try {
      const [st, arts, inqs, srvs, ports, stg] = await Promise.all([
        dataService.getStats(),
        dataService.getArticles({ onlyPublished: false }),
        dataService.getInquiries(),
        dataService.getServices({ all: true }),
        dataService.getPortfolio({ all: true }),
        dataService.getSettings()
      ]);

      setStats(st);
      setArticles(arts || []);
      setInquiries(inqs || []);
      setServices(srvs || []);
      setPortfolio(ports || []);
      if (stg) setSiteSettings(stg);
    } catch (err) {
      console.error('Gagal memuat data admin:', err);
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await dataService.login(loginInput.username, loginInput.password);
      setIsAuthenticated(true);
      setCurrentUser(res.user);
      showToastMsg(`Selamat datang, ${res.user.full_name || 'Admin'}!`);
      await loadAllData();
      if (onDataChange) onDataChange();
    } catch (err) {
      showToastMsg(err.message || 'Login gagal. Periksa username dan password.', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    dataService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToastMsg('Anda telah berhasil logout.');
  };

  // ================= ARTICLE ACTIONS =================
  const handleArticleTitleChange = (val) => {
    setArticleFormData(prev => {
      const slug = !editingArticleId 
        ? val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
        : prev.slug;
      return { ...prev, title: val, slug };
    });
  };

  const openNewArticleModal = () => {
    setEditingArticleId(null);
    setArticleFormData({
      title: '',
      slug: '',
      category: 'Tips Bisnis & UMKM',
      excerpt: '',
      content: '',
      cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      author: 'Santi Rahayu',
      author_role: 'Lead Web Strategist',
      is_published: true,
      is_featured: false,
      tags: 'Website, UMKM'
    });
    setArticlePreviewMode(false);
    setArticleEditorOpen(true);
  };

  const openEditArticleModal = (art) => {
    setEditingArticleId(art.id);
    let tagsStr = '';
    if (Array.isArray(art.tags)) tagsStr = art.tags.join(', ');
    else if (typeof art.tags === 'string') {
      try {
        const parsed = JSON.parse(art.tags);
        tagsStr = Array.isArray(parsed) ? parsed.join(', ') : art.tags;
      } catch {
        tagsStr = art.tags;
      }
    }

    setArticleFormData({
      title: art.title || '',
      slug: art.slug || '',
      category: art.category || 'Tips Bisnis & UMKM',
      excerpt: art.excerpt || '',
      content: art.content || '',
      cover_image: art.cover_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      author: art.author || 'Tim Kauki Digital',
      author_role: art.author_role || 'Lead Web Strategist',
      is_published: art.is_published !== false,
      is_featured: Boolean(art.is_featured),
      tags: tagsStr
    });
    setArticlePreviewMode(false);
    setArticleEditorOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!articleFormData.title || !articleFormData.content || !articleFormData.slug) {
      showToastMsg('Judul, slug, dan isi konten artikel wajib diisi', 'error');
      return;
    }

    const payload = {
      ...articleFormData,
      id: editingArticleId,
      tags: articleFormData.tags ? articleFormData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    try {
      await dataService.saveArticle(payload);
      showToastMsg(editingArticleId ? 'Artikel berhasil diperbarui!' : 'Artikel baru berhasil diterbitkan!');
      setArticleEditorOpen(false);
      await loadAllData();
      if (onDataChange) onDataChange();
    } catch (err) {
      showToastMsg('Gagal menyimpan artikel: ' + err.message, 'error');
    }
  };

  const handleDeleteArticle = async (id, title) => {
    if (window.confirm(`Yakin ingin menghapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await dataService.deleteArticle(id);
        showToastMsg('Artikel berhasil dihapus.');
        await loadAllData();
        if (onDataChange) onDataChange();
      } catch (err) {
        showToastMsg('Gagal menghapus artikel: ' + err.message, 'error');
      }
    }
  };

  // ================= INQUIRY / LEADS ACTIONS =================
  const getServiceDraftKey = (inquiryId, serviceKey) => `${inquiryId}:${serviceKey}`;

  const getInquiryServiceDraft = (inquiry, service) => {
    const key = getServiceDraftKey(inquiry.id, service.key);
    return serviceDrafts[key] || {
      purchased: Boolean(inquiry[service.purchasedField]),
      expires_at: formatDateInput(inquiry[service.expiryField])
    };
  };

  const updateInquiryServiceDraft = (inquiry, service, updates) => {
    const key = getServiceDraftKey(inquiry.id, service.key);
    setServiceDrafts(current => ({
      ...current,
      [key]: { ...getInquiryServiceDraft(inquiry, service), ...updates }
    }));
  };

  const handleSaveInquiryService = async (inquiry, service) => {
    const key = getServiceDraftKey(inquiry.id, service.key);
    const draft = getInquiryServiceDraft(inquiry, service);
    if (draft.purchased && !draft.expires_at) {
      showToastMsg(`Isi tanggal expired ${service.label} terlebih dahulu.`, 'error');
      return;
    }

    setSavingServiceKey(key);
    try {
      await dataService.updateInquiryService(inquiry.id, service.key, {
        purchased: draft.purchased,
        expires_at: draft.purchased ? draft.expires_at : null,
        renewal_stopped: false
      });
      setServiceDrafts(current => ({ ...current, [key]: undefined }));
      showToastMsg(`Data ${service.label} berhasil disimpan.`);
      await loadAllData();
    } catch (err) {
      showToastMsg(`Gagal menyimpan ${service.label}: ${err.message}`, 'error');
    } finally {
      setSavingServiceKey(null);
    }
  };

  const handleRenewInquiryService = async (inquiry, service) => {
    const key = getServiceDraftKey(inquiry.id, service.key);
    const expiresAt = renewalDateDrafts[key];
    if (!expiresAt) {
      showToastMsg('Pilih tanggal expired baru untuk memproses renewal.', 'error');
      return;
    }

    setSavingServiceKey(key);
    try {
      await dataService.updateInquiryService(inquiry.id, service.key, {
        purchased: true,
        expires_at: expiresAt,
        renewal_stopped: false
      });
      setRenewalDateDrafts(current => ({ ...current, [key]: undefined }));
      showToastMsg(`${service.label} berhasil diperpanjang.`);
      await loadAllData();
    } catch (err) {
      showToastMsg(`Gagal memperpanjang ${service.label}: ${err.message}`, 'error');
    } finally {
      setSavingServiceKey(null);
    }
  };

  const handleStopInquiryRenewal = async (inquiry, service) => {
    const key = getServiceDraftKey(inquiry.id, service.key);
    setSavingServiceKey(key);
    try {
      await dataService.updateInquiryService(inquiry.id, service.key, { renewal_stopped: true });
      showToastMsg(`${service.label} dikeluarkan dari daftar renewal.`);
      await loadAllData();
    } catch (err) {
      showToastMsg(`Gagal menghentikan renewal ${service.label}: ${err.message}`, 'error');
    } finally {
      setSavingServiceKey(null);
    }
  };

  const handleUpdateInquiryStatus = async (id, newStatus) => {
    try {
      await dataService.updateInquiryStatus(id, newStatus);
      showToastMsg(`Status lead berhasil diubah menjadi: ${newStatus}`);
      await loadAllData();
    } catch (err) {
      showToastMsg('Gagal mengubah status lead: ' + err.message, 'error');
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Yakin ingin menghapus data pesan/lead ini?')) {
      try {
        await dataService.deleteInquiry(id);
        showToastMsg('Lead berhasil dihapus.');
        await loadAllData();
      } catch (err) {
        showToastMsg('Gagal menghapus lead: ' + err.message, 'error');
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      await dataService.exportInquiriesCSV();
      showToastMsg('File data leads berhasil diunduh (CSV/Excel).');
    } catch (err) {
      showToastMsg('Gagal mengunduh CSV: ' + err.message, 'error');
    }
  };

  const getWhatsAppFollowUpLink = (inq) => {
    let phone = (inq.phone || '').replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '62' + phone.substring(1);
    if (!phone) return null;

    const text = `Halo Kak ${inq.name || ''}, salam dari *Kauki Digital*. Kami telah menerima konsultasi terkait *${inq.service || 'Website'}* dari formulir website. Apakah ada yang bisa kami bantu jelaskan lebih detail? 😊`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // ================= SERVICE ACTIONS =================
  const openNewServiceModal = () => {
    setEditingServiceId(null);
    setServiceFormData({
      title: '',
      badge: '',
      category: 'Website',
      price: 'Rp1.000.000',
      price_note: 'Sekali bayar • Garansi',
      description: '',
      featuresText: '1 Halaman Responsif Mobile\nTombol Chat WhatsApp\nKecepatan Loading Cepat',
      cta_text: 'Pesan Sekarang',
      cta_link: '',
      is_popular: false,
      is_active: true
    });
    setServiceEditorOpen(true);
  };

  const openEditServiceModal = (srv) => {
    setEditingServiceId(srv.id);
    const feats = Array.isArray(srv.features) ? srv.features.join('\n') : (srv.features || '');
    setServiceFormData({
      title: srv.title || '',
      badge: srv.badge || '',
      category: srv.category || 'Website',
      price: srv.price || '',
      price_note: srv.price_note || '',
      description: srv.description || '',
      featuresText: feats,
      cta_text: srv.cta_text || 'Pesan Sekarang',
      cta_link: srv.cta_link || '',
      is_popular: Boolean(srv.is_popular),
      is_active: srv.is_active !== false
    });
    setServiceEditorOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const featsArray = serviceFormData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const payload = {
      id: editingServiceId,
      title: serviceFormData.title,
      badge: serviceFormData.badge,
      category: serviceFormData.category,
      price: serviceFormData.price,
      price_note: serviceFormData.price_note,
      description: serviceFormData.description,
      features: featsArray,
      cta_text: serviceFormData.cta_text,
      cta_link: serviceFormData.cta_link || `https://wa.me/${siteSettings.whatsapp_number}?text=Halo%20Kauki%20Digital,%20saya%20tertarik%20paket%20${encodeURIComponent(serviceFormData.title)}`,
      is_popular: serviceFormData.is_popular,
      is_active: serviceFormData.is_active
    };

    try {
      await dataService.saveService(payload);
      showToastMsg(editingServiceId ? 'Paket layanan berhasil diperbarui!' : 'Paket layanan baru berhasil ditambahkan!');
      setServiceEditorOpen(false);
      await loadAllData();
      if (onDataChange) onDataChange();
    } catch (err) {
      showToastMsg('Gagal menyimpan paket layanan: ' + err.message, 'error');
    }
  };

  const handleDeleteService = async (id, title) => {
    if (window.confirm(`Hapus paket layanan "${title}"?`)) {
      try {
        await dataService.deleteService(id);
        showToastMsg('Paket layanan berhasil dihapus.');
        await loadAllData();
        if (onDataChange) onDataChange();
      } catch (err) {
        showToastMsg('Gagal menghapus layanan: ' + err.message, 'error');
      }
    }
  };

  // ================= PORTFOLIO ACTIONS =================
  const openNewPortfolioModal = () => {
    setEditingPortfolioId(null);
    setPortfolioFormData({
      title: '',
      category: 'Toko Online & F&B',
      image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      metric: '+300% Penjualan',
      description: '',
      live_url: '#',
      is_active: true
    });
    setPortfolioEditorOpen(true);
  };

  const openEditPortfolioModal = (port) => {
    setEditingPortfolioId(port.id);
    setPortfolioFormData({
      title: port.title || '',
      category: port.category || 'Toko Online & F&B',
      image_url: port.image_url || '',
      metric: port.metric || '',
      description: port.description || '',
      live_url: port.live_url || '#',
      is_active: port.is_active !== false
    });
    setPortfolioEditorOpen(true);
  };

  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    const payload = {
      ...portfolioFormData,
      id: editingPortfolioId
    };

    try {
      await dataService.savePortfolio(payload);
      showToastMsg(editingPortfolioId ? 'Portofolio berhasil diperbarui!' : 'Karya portofolio berhasil ditambahkan!');
      setPortfolioEditorOpen(false);
      await loadAllData();
      if (onDataChange) onDataChange();
    } catch (err) {
      showToastMsg('Gagal menyimpan portofolio: ' + err.message, 'error');
    }
  };

  const handleDeletePortfolio = async (id, title) => {
    if (window.confirm(`Hapus karya portofolio "${title}"?`)) {
      try {
        await dataService.deletePortfolio(id);
        showToastMsg('Karya portofolio berhasil dihapus.');
        await loadAllData();
        if (onDataChange) onDataChange();
      } catch (err) {
        showToastMsg('Gagal menghapus portofolio: ' + err.message, 'error');
      }
    }
  };

  // ================= SETTINGS ACTIONS =================
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await dataService.updateSettings(siteSettings);
      showToastMsg('Pengaturan website & kontak CS berhasil disimpan!');
      if (onDataChange) onDataChange();
    } catch (err) {
      showToastMsg('Gagal menyimpan pengaturan: ' + err.message, 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToastMsg('Password baru dan konfirmasi password tidak cocok!', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToastMsg('Password baru minimal harus 6 karakter!', 'error');
      return;
    }

    try {
      await dataService.changePassword(passwordData.oldPassword, passwordData.newPassword);
      showToastMsg('Password Admin berhasil diubah!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToastMsg(err.message || 'Gagal mengubah password', 'error');
    }
  };

  if (!isOpen) return null;

  // Filtered inquiries
  const filteredInquiries = inquiries.filter(i => {
    const matchStatus = inquiryFilter === 'all' || i.status === inquiryFilter;
    const s = inquirySearch.toLowerCase();
    const matchSearch = !s || 
      (i.name && i.name.toLowerCase().includes(s)) ||
      (i.email && i.email.toLowerCase().includes(s)) ||
      (i.phone && i.phone.toLowerCase().includes(s)) ||
      (i.message && i.message.toLowerCase().includes(s));
    return matchStatus && matchSearch;
  });

  const renewalItems = inquiries.flatMap(inquiry => INQUIRY_SERVICES.flatMap(service => {
    const expiresAt = formatDateInput(inquiry[service.expiryField]);
    if (!Boolean(inquiry[service.purchasedField]) || !expiresAt || Boolean(inquiry[service.stoppedField])) return [];
    const daysUntil = getDaysUntilExpiry(expiresAt);
    return daysUntil <= 30 ? [{ inquiry, service, expiresAt, daysUntil }] : [];
  })).sort((first, second) => first.daysUntil - second.daysUntil);

  // Filtered articles
  const filteredArticles = articles.filter(a => {
    const matchCat = articleCategory === 'Semua' || a.category === articleCategory;
    const s = articleSearch.toLowerCase();
    const matchSearch = !s || 
      (a.title && a.title.toLowerCase().includes(s)) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(s));
    return matchCat && matchSearch;
  });

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="fixed inset-0 z-[2500] bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto animate-fadeIn">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[3500] px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2.5 border transition-all animate-slideInRight ${
          toast.type === 'error' 
            ? 'bg-rose-50 border-rose-200 text-rose-700' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <Check className="w-4 h-4 text-emerald-600" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl max-w-6xl w-full h-[92vh] max-h-[92vh] shadow-2xl border border-purple-100 relative flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-[#1E1B4B] text-white px-6 py-4 flex items-center justify-between border-b border-purple-900/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand p-[2px] shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#1E1B4B] rounded-[10px] flex items-center justify-center">
                <Shield className="w-4 h-4 text-secondary" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight">Kauki Digital Portal</h3>
                <span className="text-[10px] bg-primary/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-primary/30">
                  v2.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Enterprise Content & CRM Lead Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-3 bg-purple-950/60 px-3 py-1.5 rounded-full border border-purple-800/40 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300 font-medium">Logged as: <strong className="text-white">{currentUser?.username || 'Admin'}</strong></span>
                <span className="text-[10px] bg-secondary/30 text-purple-200 px-2 py-0.5 rounded-full uppercase font-bold">{currentUser?.role || 'superadmin'}</span>
              </div>
            )}

            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                title="Keluar / Logout"
                className="text-xs font-bold bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white px-3 py-1.5 rounded-full border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {!isAuthenticated ? (
            /* ================= LOGIN VIEW ================= */
            <div className="w-full flex-1 flex items-center justify-center p-6 bg-slate-50">
              <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-purple-100 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-accent text-secondary flex items-center justify-center mx-auto shadow-sm">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-black text-[#1E1B4B]">Portal Akses Admin</h4>
                  <p className="text-xs text-slate-500">
                    Masukkan akun kredensial terdaftar untuk mengelola konten dan prospek bisnis.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Username / Email</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        required
                        value={loginInput.username}
                        onChange={(e) => setLoginInput(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="admin atau email anda"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none transition-all"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={loginInput.password}
                        onChange={(e) => setLoginInput(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loginLoading}
                    className="btn-brand w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loginLoading ? (
                      <span>Memverifikasi...</span>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Masuk ke Dashboard</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Dilindungi Enkripsi Token JWT & Bcrypt
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ================= AUTHENTICATED DASHBOARD ================= */
            <>
              {/* Sidebar Menu */}
              <div className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-800">
                
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'dashboard' ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Ringkasan Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'inquiries' ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4" />
                    <span>CRM Leads & Pesan</span>
                  </div>
                  {newInquiriesCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                      {newInquiriesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('articles')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'articles' ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Kelola Artikel ({articles.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'services' ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Paket Layanan & Harga</span>
                </button>

                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'portfolio' ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Portofolio Karya</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'settings' ? 'bg-primary text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Pengaturan Web & CS</span>
                </button>

              </div>

              {/* Main Tab Panel */}
              <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50/70">
                
                {/* 1. DASHBOARD OVERVIEW */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <h4 className="text-xl font-extrabold text-[#1E1B4B]">Ringkasan Statistik & Leads</h4>
                      <p className="text-xs text-slate-500">Pantau performa konversi website, pesan calon klien, dan konten artikel.</p>
                    </div>

                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Leads</span>
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                            <Inbox className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-[#1E1B4B]">{stats?.inquiries?.total ?? inquiries.length}</p>
                        <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                          {stats?.inquiries?.new ?? newInquiriesCount} Belum Dihubungi
                        </span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Artikel</span>
                          <div className="w-8 h-8 rounded-xl bg-purple-50 text-secondary flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-[#1E1B4B]">{stats?.articles?.total ?? articles.length}</p>
                        <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                          {stats?.articles?.total_views ?? 0} Total Pembaca
                        </span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paket Layanan</span>
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Briefcase className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-[#1E1B4B]">{services.length}</p>
                        <span className="text-[11px] text-slate-500 font-medium mt-1 block">Aktif di Landing Page</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Portofolio</span>
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Layers className="w-4 h-4" />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-[#1E1B4B]">{portfolio.length}</p>
                        <span className="text-[11px] text-slate-500 font-medium mt-1 block">Studi Kasus Klien</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-brand text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h5 className="font-extrabold text-base mb-1">Aksi Cepat Admin</h5>
                        <p className="text-xs text-purple-100">Tambah konten artikel baru atau export data leads untuk follow up WhatsApp marketing.</p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                          onClick={openNewArticleModal}
                          className="bg-white text-secondary hover:bg-purple-50 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tulis Artikel</span>
                        </button>
                        <button 
                          onClick={handleExportCSV}
                          className="bg-purple-950/50 hover:bg-purple-950 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-purple-300/30 flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Leads CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Recent Inquiries */}
                    <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-[#1E1B4B]">5 Prospek / Pesan Terkini</h5>
                        <button 
                          onClick={() => setActiveTab('inquiries')}
                          className="text-xs font-bold text-secondary hover:underline"
                        >
                          Lihat Semua ({inquiries.length}) &rarr;
                        </button>
                      </div>

                      {inquiries.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">Belum ada pesan / inquiry masuk.</p>
                      ) : (
                        <div className="space-y-3">
                          {inquiries.slice(0, 5).map((inq, idx) => {
                            const waLink = getWhatsAppFollowUpLink(inq);
                            return (
                              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-[#1E1B4B]">{inq.name}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      inq.status === 'new' ? 'bg-rose-100 text-rose-700' :
                                      inq.status === 'contacted' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                      {inq.status === 'new' ? 'Baru' : inq.status === 'contacted' ? 'Dihubungi' : 'Closed'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 line-clamp-1">{inq.service} • {inq.budget} • "{inq.message}"</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  {waLink && (
                                    <a 
                                      href={waLink} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="btn-whatsapp text-[11px] font-bold py-1.5 px-3 rounded-lg text-white flex items-center gap-1 shadow-sm"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>Follow-up WA</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. CRM LEADS / INQUIRIES TAB */}
                {activeTab === 'inquiries' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-[#1E1B4B]">CRM Leads & Konsultasi Masuk</h4>
                        <p className="text-xs text-slate-500">Kelola calon klien, follow-up langsung via WhatsApp, dan simpan kontak ke Excel.</p>
                      </div>

                      <button 
                        onClick={handleExportCSV}
                        className="btn-brand text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export ke Excel / CSV</span>
                      </button>
                    </div>

                    <div className="flex gap-2 border-b border-slate-200">
                      <button
                        type="button"
                        onClick={() => setInquiryView('leads')}
                        className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${inquiryView === 'leads' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                        Lead & Konsultasi
                      </button>
                      <button
                        type="button"
                        onClick={() => setInquiryView('renewal')}
                        className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${inquiryView === 'renewal' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      >
                        Renewal ({renewalItems.length})
                      </button>
                    </div>

                    {inquiryView === 'leads' ? (
                      <div className="space-y-6">
                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                        {['all', 'new', 'contacted', 'closed'].map(st => (
                          <button
                            key={st}
                            onClick={() => setInquiryFilter(st)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                              inquiryFilter === st ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st === 'all' ? 'Semua Status' : st === 'new' ? 'Baru' : st === 'contacted' ? 'Dihubungi' : 'Closed'}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          value={inquirySearch}
                          onChange={(e) => setInquirySearch(e.target.value)}
                          placeholder="Cari nama / email / WA..."
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Leads List */}
                    {filteredInquiries.length === 0 ? (
                      <div className="bg-white p-12 text-center rounded-2xl border border-purple-100 text-slate-400 text-xs">
                        Tidak ada data prospek yang sesuai filter.
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {filteredInquiries.map((inq) => {
                          const waLink = getWhatsAppFollowUpLink(inq);
                          return (
                            <div key={inq.id} className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                <div>
                                  <h5 className="font-bold text-base text-[#1E1B4B]">{inq.name}</h5>
                                  <span className="text-[11px] text-slate-400">
                                    {new Date(inq.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <select 
                                    value={inq.status}
                                    onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:border-primary focus:outline-none"
                                  >
                                    <option value="new">🔴 Status: Baru</option>
                                    <option value="contacted">🟡 Status: Dihubungi</option>
                                    <option value="closed">🟢 Status: Closed</option>
                                  </select>

                                  <button 
                                    onClick={() => handleDeleteInquiry(inq.id)}
                                    title="Hapus Lead"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600">
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                                  <span className="font-semibold text-slate-800">{inq.email}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp / Telepon</span>
                                  <span className="font-semibold text-slate-800">{inq.phone || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Paket Diminati & Budget</span>
                                  <span className="font-semibold text-slate-800">{inq.service} ({inq.budget})</span>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-3 gap-3">
                                {INQUIRY_SERVICES.map((service) => {
                                  const key = getServiceDraftKey(inq.id, service.key);
                                  const draft = getInquiryServiceDraft(inq, service);
                                  return (
                                    <div key={service.key} className="rounded-xl border border-slate-200 p-3 space-y-3">
                                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={draft.purchased}
                                          onChange={(e) => updateInquiryServiceDraft(inq, service, { purchased: e.target.checked })}
                                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                        {service.label} dibeli
                                      </label>
                                      {draft.purchased && (
                                        <label className="block text-[11px] font-semibold text-slate-500">
                                          Tanggal expired <span className="text-rose-500">*</span>
                                          <input
                                            type="date"
                                            required
                                            value={draft.expires_at}
                                            onChange={(e) => updateInquiryServiceDraft(inq, service, { expires_at: e.target.value })}
                                            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 focus:border-primary focus:outline-none"
                                          />
                                        </label>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleSaveInquiryService(inq, service)}
                                        disabled={savingServiceKey === key}
                                        className="w-full rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                                      >
                                        {savingServiceKey === key ? 'Menyimpan...' : 'Simpan layanan'}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pesan dari Klien:</span>
                                <p className="whitespace-pre-wrap">{inq.message}</p>
                              </div>

                              {waLink && (
                                <div className="flex justify-end pt-1">
                                  <a 
                                    href={waLink} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="btn-whatsapp text-xs font-bold py-2 px-4 rounded-xl text-white flex items-center gap-2 shadow-md shadow-emerald-500/20"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Chat WA Calon Klien Sekarang (1-Klik)</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-xs text-slate-500">Layanan yang sudah expired atau akan expired dalam 30 hari.</p>
                        {renewalItems.length === 0 ? (
                          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
                            Belum ada layanan yang perlu diperpanjang.
                          </div>
                        ) : renewalItems.map(({ inquiry, service, expiresAt, daysUntil }) => {
                          const key = getServiceDraftKey(inquiry.id, service.key);
                          const renewalDate = renewalDateDrafts[key] || '';
                          return (
                            <div key={key} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
                              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                                <div>
                                  <p className="text-xs font-bold uppercase text-amber-700">{service.label}</p>
                                  <h5 className="mt-1 font-bold text-[#1E1B4B]">{inquiry.name}</h5>
                                  <p className="mt-1 text-xs text-slate-500">Expired {new Date(`${expiresAt}T00:00:00`).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                                  <p className="mt-1 text-xs font-semibold text-amber-700">
                                    {daysUntil < 0 ? `Terlambat ${Math.abs(daysUntil)} hari` : daysUntil === 0 ? 'Expired hari ini' : `${daysUntil} hari lagi`}
                                  </p>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                                  <label className="text-[11px] font-semibold text-slate-500">
                                    Tanggal expired baru
                                    <input
                                      type="date"
                                      min={new Date().toISOString().slice(0, 10)}
                                      value={renewalDate}
                                      onChange={(e) => setRenewalDateDrafts(current => ({ ...current, [key]: e.target.value }))}
                                      className="mt-1 block rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-800 focus:border-primary focus:outline-none"
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleRenewInquiryService(inquiry, service)}
                                    disabled={!renewalDate || savingServiceKey === key}
                                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Renew
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStopInquiryRenewal(inquiry, service)}
                                    disabled={savingServiceKey === key}
                                    className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                                  >
                                    Stop
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. ARTICLES CMS TAB */}
                {activeTab === 'articles' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-[#1E1B4B]">Kelola Artikel & Wawasan Edukasi</h4>
                        <p className="text-xs text-slate-500">Tulis artikel SEO untuk mendatangkan traffic organik dari Google.</p>
                      </div>

                      <button 
                        onClick={openNewArticleModal}
                        className="btn-brand text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tulis Artikel Baru</span>
                      </button>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                        {['Semua', 'Tips Bisnis & UMKM', 'Domain & Email Bisnis', 'Website & Desain', 'SEO & Digital Marketing'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setArticleCategory(cat)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                              articleCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          value={articleSearch}
                          onChange={(e) => setArticleSearch(e.target.value)}
                          placeholder="Cari judul artikel..."
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid gap-4">
                      {filteredArticles.map(art => (
                        <div key={art.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={art.cover_image} 
                              alt={art.title} 
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                            />
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold bg-accent text-secondary px-2.5 py-0.5 rounded-full">
                                  {art.category}
                                </span>
                                {art.is_featured && (
                                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5" /> Featured
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-sm sm:text-base text-[#1E1B4B]">{art.title}</h5>
                              <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                                <span>{art.author}</span>
                                <span>•</span>
                                <span>{art.read_time || '4 menit'}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                                  <Eye className="w-3 h-3" /> {art.views || 0} views
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button 
                              onClick={() => openEditArticleModal(art)}
                              className="p-2 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                              title="Edit Artikel"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteArticle(art.id, art.title)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              title="Hapus Artikel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. SERVICES TAB */}
                {activeTab === 'services' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-[#1E1B4B]">Kelola Paket Layanan & Harga</h4>
                        <p className="text-xs text-slate-500">Ubah harga paket website, fitur bullet points, dan tombol pemesanan.</p>
                      </div>

                      <button 
                        onClick={openNewServiceModal}
                        className="btn-brand text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Paket Layanan</span>
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {services.map(srv => (
                        <div key={srv.id} className="bg-white rounded-2xl border border-purple-100 p-6 shadow-sm flex flex-col justify-between relative">
                          {srv.is_popular && (
                            <span className="absolute top-4 right-4 bg-secondary text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                              {srv.badge || 'Populer'}
                            </span>
                          )}

                          <div className="space-y-3">
                            <h5 className="font-extrabold text-lg text-[#1E1B4B]">{srv.title}</h5>
                            <p className="text-xs text-slate-500">{srv.description}</p>
                            
                            <div className="py-2 border-y border-slate-100">
                              <span className="text-xl font-black text-primary">{srv.price}</span>
                              <span className="text-[11px] text-slate-400 block">{srv.price_note}</span>
                            </div>

                            <ul className="space-y-1.5 text-xs text-slate-600">
                              {(Array.isArray(srv.features) ? srv.features : []).map((f, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                  <span className="line-clamp-1">{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${srv.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {srv.is_active ? 'Aktif di Web' : 'Non-aktif'}
                            </span>

                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => openEditServiceModal(srv)}
                                className="p-1.5 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-lg"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteService(srv.id, srv.title)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. PORTFOLIO TAB */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-extrabold text-[#1E1B4B]">Kelola Portofolio & Karya</h4>
                        <p className="text-xs text-slate-500">Pamerkan website hasil buatan tim Anda beserta hasil konversinya.</p>
                      </div>

                      <button 
                        onClick={openNewPortfolioModal}
                        className="btn-brand text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Portofolio</span>
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {portfolio.map(port => (
                        <div key={port.id} className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm flex flex-col justify-between">
                          <div className="h-40 overflow-hidden relative bg-slate-100">
                            <img src={port.image_url} alt={port.title} className="w-full h-full object-cover" />
                            {port.metric && (
                              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-[#1E1B4B] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span>{port.metric}</span>
                              </div>
                            )}
                          </div>

                          <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-primary uppercase">{port.category}</span>
                              <h5 className="font-bold text-sm text-[#1E1B4B]">{port.title}</h5>
                              <p className="text-xs text-slate-500 line-clamp-2">{port.description}</p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${port.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {port.is_active ? 'Tampil' : 'Disembunyikan'}
                              </span>

                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => openEditPortfolioModal(port)}
                                  className="p-1.5 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-lg"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeletePortfolio(port.id, port.title)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <div className="space-y-8 animate-fadeIn max-w-3xl">
                    <div>
                      <h4 className="text-xl font-extrabold text-[#1E1B4B]">Pengaturan Website & CS</h4>
                      <p className="text-xs text-slate-500">Sesuaikan nomor WhatsApp CS, jam layanan, teks banner promo, dan keamanan password.</p>
                    </div>

                    {/* Site Settings Form */}
                    <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-5">
                      <h5 className="font-extrabold text-sm text-[#1E1B4B] flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>Informasi Kontak & CS Website</span>
                      </h5>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp CS Utama (Format: 628...)</label>
                          <input 
                            type="text" 
                            value={siteSettings.whatsapp_number}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400">Semua tombol konsultasi WhatsApp otomatis menggunakan nomor ini.</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kontak CS</label>
                          <input 
                            type="text" 
                            value={siteSettings.whatsapp_cs_name}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, whatsapp_cs_name: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email Resmi</label>
                          <input 
                            type="email" 
                            value={siteSettings.email_contact}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, email_contact: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Jam Operasional CS</label>
                          <input 
                            type="text" 
                            value={siteSettings.operating_hours}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, operating_hours: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <h5 className="font-extrabold text-sm text-[#1E1B4B] flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Banner Pengumuman / Promo Berjalan</span>
                        </h5>

                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id="promoBannerToggle"
                            checked={siteSettings.promo_banner_active === 'true' || siteSettings.promo_banner_active === true}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, promo_banner_active: e.target.checked ? 'true' : 'false' }))}
                            className="w-4 h-4 text-primary rounded"
                          />
                          <label htmlFor="promoBannerToggle" className="text-xs font-bold text-slate-700">
                            Aktifkan Banner Promo di bagian atas website
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Teks Pengumuman Promo</label>
                          <input 
                            type="text" 
                            value={siteSettings.promo_banner_text}
                            onChange={(e) => setSiteSettings(prev => ({ ...prev, promo_banner_text: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button type="submit" className="btn-brand text-xs font-bold py-2.5 px-6 rounded-xl shadow-md">
                          Simpan Pengaturan
                        </button>
                      </div>
                    </form>

                    {/* Change Password Form */}
                    <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4">
                      <h5 className="font-extrabold text-sm text-[#1E1B4B] flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-secondary" />
                        <span>Ganti Password Admin</span>
                      </h5>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Password Saat Ini</label>
                          <input 
                            type="password" 
                            required
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                            placeholder="Password lama"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
                          <input 
                            type="password" 
                            required
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Min. 6 karakter"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
                          <input 
                            type="password" 
                            required
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Ketik ulang password baru"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-md">
                          Perbarui Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </>
          )}

        </div>
      </div>

      {/* ================= ARTICLE EDITOR MODAL ================= */}
      {articleEditorOpen && (
        <div className="fixed inset-0 z-[3200] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-6 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-4 border-b border-purple-100">
              <h4 className="text-xl font-extrabold text-[#1E1B4B]">
                {editingArticleId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h4>
              <button 
                onClick={() => setArticleEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Artikel</label>
                <input 
                  type="text" 
                  required
                  value={articleFormData.title}
                  onChange={(e) => handleArticleTitleChange(e.target.value)}
                  placeholder="Contoh: 7 Strategi Meningkatkan Penjualan Website UMKM 2026"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slug URL (SEO)</label>
                  <input 
                    type="text" 
                    required
                    value={articleFormData.slug}
                    onChange={(e) => setArticleFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="strategi-penjualan-website-umkm"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select 
                    value={articleFormData.category}
                    onChange={(e) => setArticleFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:outline-none"
                  >
                    <option value="Tips Bisnis & UMKM">Tips Bisnis & UMKM</option>
                    <option value="Domain & Email Bisnis">Domain & Email Bisnis</option>
                    <option value="Website & Desain">Website & Desain</option>
                    <option value="SEO & Digital Marketing">SEO & Digital Marketing</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Cover Gambar</label>
                  <input 
                    type="text" 
                    value={articleFormData.cover_image}
                    onChange={(e) => setArticleFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Pisahkan koma)</label>
                  <input 
                    type="text" 
                    value={articleFormData.tags}
                    onChange={(e) => setArticleFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Website, UMKM, Penjualan"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat (Excerpt)</label>
                <textarea 
                  rows={2}
                  required
                  value={articleFormData.excerpt}
                  onChange={(e) => setArticleFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Ringkasan 1-2 kalimat untuk preview di kartu blog..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              {/* Markdown Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Konten Artikel (Markdown Didukung)</label>
                  <button 
                    type="button"
                    onClick={() => setArticlePreviewMode(!articlePreviewMode)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{articlePreviewMode ? 'Edit Markdown' : 'Live Preview'}</span>
                  </button>
                </div>

                {articlePreviewMode ? (
                  <div 
                    className="article-body p-5 bg-slate-50 rounded-2xl border border-slate-200 min-h-[220px] max-h-[350px] overflow-y-auto text-xs sm:text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: marked.parse(articleFormData.content || '*Belum ada isi konten artikel.*') }}
                  />
                ) : (
                  <textarea 
                    rows={8}
                    required
                    value={articleFormData.content}
                    onChange={(e) => setArticleFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Tulis artikel dalam format Markdown: ## Subheading, **Bold**, - Bullet list, dll..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none leading-relaxed"
                  />
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input 
                    type="checkbox"
                    checked={articleFormData.is_published}
                    onChange={(e) => setArticleFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Publikasikan Sekarang</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input 
                    type="checkbox"
                    checked={articleFormData.is_featured}
                    onChange={(e) => setArticleFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Jadikan Artikel Unggulan (Featured)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-purple-100">
                <button 
                  type="button" 
                  onClick={() => setArticleEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-brand px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
                >
                  Simpan & Terbitkan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================= SERVICE EDITOR MODAL ================= */}
      {serviceEditorOpen && (
        <div className="fixed inset-0 z-[3200] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h4 className="text-xl font-extrabold text-[#1E1B4B]">
                {editingServiceId ? 'Edit Paket Layanan' : 'Tambah Paket Baru'}
              </h4>
              <button 
                onClick={() => setServiceEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Paket Layanan</label>
                <input 
                  type="text" 
                  required
                  value={serviceFormData.title}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: Toko Online E-Commerce"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Harga (Format Teks)</label>
                  <input 
                    type="text" 
                    required
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Rp1.500.000"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Harga</label>
                  <input 
                    type="text" 
                    value={serviceFormData.price_note}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, price_note: e.target.value }))}
                    placeholder="Sekali bayar • Gratis Domain"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Highlight (Opsional)</label>
                <input 
                  type="text" 
                  value={serviceFormData.badge}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="Paling Populer / Hemat"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea 
                  rows={2}
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi target bisnis paket ini..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daftar Fitur (1 fitur per baris)</label>
                <textarea 
                  rows={4}
                  value={serviceFormData.featuresText}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, featuresText: e.target.value }))}
                  placeholder="1 Halaman Responsif Mobile&#10;Integrasi WhatsApp Direct&#10;Domain .com Gratis 1 Tahun"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={serviceFormData.is_popular}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, is_popular: e.target.checked }))}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Sorot sebagai Paket Populer</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={serviceFormData.is_active}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Aktif di Halaman Web</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-purple-100">
                <button 
                  type="button" 
                  onClick={() => setServiceEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Batal
                </button>
                <button type="submit" className="btn-brand px-5 py-2 rounded-xl font-bold text-xs">
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PORTFOLIO EDITOR MODAL ================= */}
      {portfolioEditorOpen && (
        <div className="fixed inset-0 z-[3200] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <h4 className="text-xl font-extrabold text-[#1E1B4B]">
                {editingPortfolioId ? 'Edit Portofolio' : 'Tambah Karya Baru'}
              </h4>
              <button 
                onClick={() => setPortfolioEditorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Proyek / Klien</label>
                <input 
                  type="text" 
                  required
                  value={portfolioFormData.title}
                  onChange={(e) => setPortfolioFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: Kopi Nusantara Co."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Proyek</label>
                  <input 
                    type="text" 
                    required
                    value={portfolioFormData.category}
                    onChange={(e) => setPortfolioFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Toko Online, Salon, Klinik"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Metrik Hasil Klien</label>
                  <input 
                    type="text" 
                    value={portfolioFormData.metric}
                    onChange={(e) => setPortfolioFormData(prev => ({ ...prev, metric: e.target.value }))}
                    placeholder="+320% Order Online"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Cover Gambar</label>
                <input 
                  type="text" 
                  required
                  value={portfolioFormData.image_url}
                  onChange={(e) => setPortfolioFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat Karya</label>
                <textarea 
                  rows={2}
                  required
                  value={portfolioFormData.description}
                  onChange={(e) => setPortfolioFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Website toko kopi dengan katalog menu dan direct checkout..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#1E1B4B] focus:border-primary focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox"
                  id="portActive"
                  checked={portfolioFormData.is_active}
                  onChange={(e) => setPortfolioFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="portActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Tampilkan di Galeri Portofolio Web
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-purple-100">
                <button 
                  type="button" 
                  onClick={() => setPortfolioEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Batal
                </button>
                <button type="submit" className="btn-brand px-5 py-2 rounded-xl font-bold text-xs">
                  Simpan Portofolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
