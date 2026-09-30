import React, { useState, useEffect } from 'react';
import { SEED_PROJECTS } from '../data/seed';
import { dataService } from '../lib/storage';
import { Sparkles, TrendingUp, ExternalLink, ShieldCheck, CheckCircle2, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const SAMPLE_WEBSITES = [
  {
    title: 'Kauki Digital',
    category: 'Company Profile',
    description: 'Contoh website agensi digital dengan layanan, paket, dan konsultasi.',
    url: '/sample/index.html'
  },
  {
    title: 'Armada Prima',
    category: 'Rental Mobil',
    description: 'Website bisnis lokal untuk menampilkan armada dan layanan rental.',
    url: '/sample/bisnis-lokal.html'
  },
  {
    title: 'KAP Arjuna & Rekan',
    category: 'Jasa Profesional',
    description: 'Company profile kantor akuntan publik dengan layanan konsultasi.',
    url: '/sample/konsultan.html'
  },
  {
    title: 'Izakaya Rempah',
    category: 'Kuliner',
    description: 'Website restoran dengan menu dan informasi reservasi.',
    url: '/sample/kuliner.html'
  },
  {
    title: 'RoseBlush',
    category: 'Salon & Kecantikan',
    description: 'Website salon untuk menampilkan layanan, tim, dan galeri.',
    url: '/sample/salon.html'
  },
  {
    title: 'LittleCharm',
    category: 'Toko Online',
    description: 'Contoh katalog belanja untuk produk pakaian anak.',
    url: '/sample/toko-online.html'
  }
];

export default function Portfolio({ refreshTrigger }) {
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [samplePage, setSamplePage] = useState(0);
  const samplesPerPage = 3;
  const samplePageCount = Math.ceil(SAMPLE_WEBSITES.length / samplesPerPage);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const ports = await dataService.getPortfolio({ all: false });
        if (ports && ports.length > 0) {
          setProjects(ports);
        } else {
          setProjects(SEED_PROJECTS);
        }
      } catch (err) {
        console.warn('Gagal memuat portfolio:', err);
        setProjects(SEED_PROJECTS);
      }
    };
    loadProjects();
  }, [refreshTrigger]);

  return (
    <section id="portfolio" className="py-24 relative bg-white border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-secondary bg-accent px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studi Kasus & Design</span>
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1E1B4B] tracking-tight">
              Inspirasi design website <span className="text-gradient-primary">profesional dan menarik</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Buktikan sendiri kualitas pengerjaan tim Kauki Digital. Klik tombol <strong>"Lihat Live Website"</strong> untuk membuka dan menjelajahi design website yang telah kami buat.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center gap-3 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1E1B4B]">100% Karya Asli</p>
              <p className="text-[11px] text-slate-500">Live on Vercel Cloud Server</p>
            </div>
          </div>
        </div>

        {/* Featured Projects Grid (2 Big Showcase Cards) */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((proj, idx) => {
            const isFirst = idx === 0;
            const liveLink = proj.live_url || (isFirst ? 'https://kap-kantor-akuntan-publik.vercel.app/' : 'https://projek-sampingan-ten.vercel.app/');
            const defaultImage = isFirst 
              ? 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
              : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
            const displayImage = proj.image_url || defaultImage;

            const tags = Array.isArray(proj.tags) 
              ? proj.tags 
              : (isFirst ? ['Assurance & Audit', 'KAP Terdaftar', 'Loading Kilat 99/100', 'Mobile Responsive'] : ['Tax Advisory', 'Corporate Strategy', 'Luxury Emerald Aesthetic', 'High Conversion']);

            return (
              <div 
                key={proj.id || idx} 
                className="clean-card group overflow-hidden bg-white border border-slate-200/90 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                {/* Browser Frame Simulation */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] px-3 py-1 rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Verified Live Project</span>
                    </div>
                  </div>

                  {/* URL Bar */}
                  <div className="bg-white px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-600 border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <Globe className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{liveLink.replace('https://', '')}</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">SSL Active</span>
                  </div>
                </div>

                {/* Project Thumbnail Image with Hover Zoom */}
                <div className="h-64 sm:h-72 overflow-hidden relative bg-slate-900 group">
                  <img 
                    src={displayImage} 
                    alt={proj.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95" 
                  />
                  
                  {/* Floating Metric Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#1E1B4B] text-xs font-extrabold px-3 py-1.5 rounded-full border border-slate-200/80 flex items-center gap-1.5 shadow-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>{proj.metric || 'Live Production'}</span>
                  </div>
                </div>

                {/* Content & Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                      {proj.category}
                    </span>
                    <h3 className="font-black text-2xl text-[#1E1B4B] tracking-tight group-hover:text-primary transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {proj.description || proj.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx}
                          className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link to Real Vercel Website */}
                  <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Siap dites di HP & Desktop</span>
                    </div>

                    <a 
                      href={liveLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-primary w-full sm:w-auto py-3 px-6 rounded-full text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all cursor-pointer"
                    >
                      <span>Buka Live Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        <div className="mt-20">
          <div className="mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B]">Sample Website</h3>
              <p className="text-slate-600 text-sm mt-2">Jelajahi contoh desain untuk berbagai jenis bisnis.</p>
            </div>
          </div>

          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-3">
            <button
              type="button"
              onClick={() => setSamplePage((page) => Math.max(0, page - 1))}
              aria-label="Lihat sample sebelumnya"
              title="Lihat sample sebelumnya"
              disabled={samplePage === 0}
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div key={samplePage} aria-live="polite" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAMPLE_WEBSITES.slice(samplePage * samplesPerPage, (samplePage + 1) * samplesPerPage).map((sample) => (
                <article key={sample.url} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-56 bg-slate-100 overflow-hidden">
                  <iframe
                    src={sample.url}
                    title={`Preview ${sample.title}`}
                    loading="lazy"
                    sandbox="allow-forms allow-scripts allow-popups"
                    className="h-full w-full border-0 bg-white"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase text-primary">{sample.category}</p>
                  <h4 className="mt-1 text-lg font-bold text-[#1E1B4B]">{sample.title}</h4>
                  <p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-600">{sample.description}</p>
                  <a
                    href={sample.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-4 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white"
                  >
                    Buka Sample Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSamplePage((page) => Math.min(samplePageCount - 1, page + 1))}
              aria-label="Lihat sample berikutnya"
              title="Lihat sample berikutnya"
              disabled={samplePage >= samplePageCount - 1}
              className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
