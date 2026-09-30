import React, { useState, useEffect } from 'react';
import { Globe, Building, Mail, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { dataService } from '../lib/storage';
import { SEED_SERVICES } from '../data/seed';

export default function Services({ refreshTrigger }) {
  const [packages, setPackages] = useState(SEED_SERVICES);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const loadServicesData = async () => {
      try {
        const [srvs, stg] = await Promise.all([
          dataService.getServices({ all: false }),
          dataService.getSettings()
        ]);
        if (srvs && srvs.length > 0) setPackages(srvs);
        if (stg) setSiteSettings(stg);
      } catch (err) {
        console.warn('Gagal memuat services:', err);
      }
    };
    loadServicesData();
  }, [refreshTrigger]);

  const waNumber = siteSettings?.whatsapp_number || '6283835782376';

  const getIcon = (iconName, category) => {
    if (iconName === 'Building' || category === 'Corporate') return Building;
    if (iconName === 'Mail' || category === 'Email') return Mail;
    return Globe;
  };

  return (
    <section id="services" className="py-24 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-secondary bg-accent px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Pilihan Paket Transparan
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B]">
            Solusi All in One untuk Semua Skala Bisnis
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Mulai dari landing page hingga website profesional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => {
            const Icon = getIcon(pkg.icon_name, pkg.category);
            const features = Array.isArray(pkg.features) ? pkg.features : [];
            const ctaLink = pkg.cta_link || `https://wa.me/${waNumber}?text=Halo%20Kauki%20Digital,%20saya%20tertarik%20paket%20${encodeURIComponent(pkg.title)}`;

            return (
              <div 
                key={pkg.id || idx}
                className={`clean-card p-8 flex flex-col justify-between relative bg-white transition-all duration-300 hover:shadow-2xl ${
                  pkg.is_popular ? 'border-primary ring-2 ring-primary/20 shadow-xl shadow-blue-500/10' : ''
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3.5 right-6 bg-gradient-brand text-white text-[11px] font-black uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{pkg.badge || 'Paling Populer'}</span>
                  </div>
                )}

                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                    pkg.is_popular ? 'bg-purple-100 text-secondary' : 'bg-blue-50 text-primary'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#1E1B4B] mb-2">{pkg.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">{pkg.description}</p>

                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <span className="text-xs text-slate-500 block mb-1">Mulai dari</span>
                    <p className={`text-3xl font-black ${pkg.is_popular ? 'text-transparent bg-clip-text bg-gradient-brand' : 'text-[#1E1B4B]'}`}>
                      {pkg.price}
                    </p>
                    {pkg.price_note && (
                      <span className="text-xs text-emerald-600 font-semibold">{pkg.price_note}</span>
                    )}
                  </div>

                  <ul className="space-y-3 text-xs sm:text-sm text-slate-600 mb-8">
                    {features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full text-center py-3.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    pkg.is_popular ? 'btn-primary text-white' : 'btn-secondary'
                  }`}
                >
                  <span>{pkg.cta_text || 'Pilih Paket Ini'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
