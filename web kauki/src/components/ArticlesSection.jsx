import React, { useState, useEffect } from 'react';
import { dataService } from '../lib/storage';
import { Search, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function ArticlesSection({ onOpenArticle, refreshTrigger }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [category, setCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const categories = [
    'Semua',
    'Tips Bisnis & UMKM',
    'Website & Desain',
    'SEO & Digital Marketing',
    'Domain & Email Bisnis'
  ];

  useEffect(() => {
    async function load() {
      const data = await dataService.getArticles({ onlyPublished: true });
      setArticles(data);
      setFilteredArticles(data);
    }
    load();
  }, [refreshTrigger]);

  useEffect(() => {
    let list = articles;
    if (category !== 'Semua') {
      list = list.filter(a => a.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
    }
    setFilteredArticles(list);
  }, [category, search, articles]);

  const featured = articles.find(a => a.is_featured) || articles[0];

  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'Tips Bisnis & UMKM': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Website & Desain': return 'bg-blue-50 text-primary border-blue-200';
      case 'SEO & Digital Marketing': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Domain & Email Bisnis': return 'bg-accent text-secondary border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id="articles" className="py-24 relative bg-[#F8FAFC] border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <span className="text-xs font-bold text-secondary bg-accent px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Wawasan & Edukasi
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B]">
            Artikel & Panduan Digital Bisnis
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Tips praktis seputar pembuatan website, strategi SEO Google, email bisnis, dan cara melipatgandakan omzet UMKM.
          </p>

          {/* Search Input */}
          <div className="pt-2 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari topik artikel (SEO, UMKM, Email, Landing Page)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-purple-100 rounded-full pl-12 pr-4 py-3 text-xs sm:text-sm text-[#1E1B4B] placeholder-slate-400 focus:border-primary focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
                category === cat 
                  ? 'btn-brand text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:text-secondary border border-purple-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article Card */}
        {featured && category === 'Semua' && !search && (
          <div className="mb-12 agency-card overflow-hidden group border-purple-100 p-0 bg-white shadow-lg">
            <div className="grid lg:grid-cols-12 gap-0 items-center">
              <div className="lg:col-span-7 h-60 lg:h-[340px] overflow-hidden relative bg-slate-100">
                <img 
                  src={featured.cover_image} 
                  alt={featured.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-black bg-gradient-brand text-white px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> FEATURED • {featured.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                    <span>{new Date(featured.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{featured.read_time || '5 menit baca'}</span>
                  </div>

                  <h3 
                    onClick={() => onOpenArticle(featured)}
                    className="text-xl sm:text-2xl font-bold text-[#1E1B4B] mb-3 hover:text-secondary transition-colors leading-tight cursor-pointer"
                  >
                    {featured.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 mb-6 leading-relaxed">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-purple-50">
                  <div className="flex items-center gap-2.5">
                    <img src={featured.author_avatar} alt={featured.author} className="w-8 h-8 rounded-full object-cover border border-purple-200" />
                    <span className="text-xs font-bold text-[#1E1B4B]">{featured.author}</span>
                  </div>

                  <button 
                    onClick={() => onOpenArticle(featured)}
                    className="btn-brand text-xs font-bold py-2 px-4 rounded-full text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Baca Artikel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Cards Grid */}
        {filteredArticles.length === 0 ? (
          <div className="agency-card p-10 text-center max-w-md mx-auto space-y-3 bg-white">
            <BookOpen className="w-10 h-10 text-secondary mx-auto" />
            <h4 className="text-base font-bold text-[#1E1B4B]">Tidak ada artikel ditemukan</h4>
            <p className="text-xs text-slate-500">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
            <button onClick={() => { setCategory('Semua'); setSearch(''); }} className="btn-brand text-xs py-2 px-4 rounded-full text-white font-bold mt-2">
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <article key={art.id} className="agency-card group flex flex-col justify-between overflow-hidden bg-white">
                <div className="h-44 overflow-hidden relative bg-slate-100">
                  <img 
                    src={art.cover_image} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${getCategoryClass(art.category)}`}>
                      {art.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                      <Clock className="w-3 h-3 text-secondary" />
                      <span>{art.read_time || '4 menit'}</span>
                    </div>

                    <h4 
                      onClick={() => onOpenArticle(art)}
                      className="font-bold text-base text-[#1E1B4B] mb-2 line-clamp-2 hover:text-secondary transition-colors cursor-pointer"
                    >
                      {art.title}
                    </h4>

                    <p className="text-slate-600 text-xs line-clamp-3 mb-5 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">{art.author}</span>
                    <button 
                      onClick={() => onOpenArticle(art)}
                      className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 transition-colors"
                    >
                      <span>Baca Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
