import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../lib/storage';
import { ArrowRight, Clock } from 'lucide-react';

export default function LatestArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await dataService.getArticles({ onlyPublished: true });
      setArticles(data.slice(0, 3));
    }
    load();
  }, []);

  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'Tips Bisnis & UMKM': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Website & Desain': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SEO & Digital Marketing': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Domain & Email Bisnis': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section className="py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs font-bold text-secondary bg-accent px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Wawasan & Edukasi
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B]">
              Artikel & Tips Bisnis Terbaru
            </h2>
          </div>
          <Link 
            to="/articles" 
            className="text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full bg-slate-50 hover:bg-slate-100 text-[#1E1B4B] border border-slate-200 flex items-center gap-2 transition-all self-start md:self-auto shadow-sm"
          >
            <span>Lihat Semua Artikel</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article key={art.id} className="clean-card group flex flex-col justify-between overflow-hidden bg-white">
              <div className="h-48 overflow-hidden relative bg-slate-100">
                <img 
                  src={art.cover_image} 
                  alt={art.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${getCategoryClass(art.category)}`}>
                    {art.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span>{art.read_time || '4 menit'}</span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-[#1E1B4B] mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/articles/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 mb-6 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{art.author}</span>
                  <Link 
                    to={`/articles/${art.slug}`}
                    className="text-xs font-bold text-primary hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
