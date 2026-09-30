import React from 'react';
import { Coffee, HeartPulse, Scale, Store, Sparkles } from 'lucide-react';

export default function TrustMetrics() {
  const industries = [
    { name: 'Coffee & F&B', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Klinik & Dokter', icon: HeartPulse, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Konsultan & Law Firm', icon: Scale, color: 'text-secondary', bg: 'bg-purple-50' },
    { name: 'Retail & E-Commerce', icon: Store, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Salon & Beauty Bar', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50' },
  ];

  return (
    <section className="py-12 border-y border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase font-bold tracking-widest text-slate-500 mb-8">
          Siap Membantu Transformasi Digital Berbagai Sektor Bisnis di Indonesia
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {industries.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-[#1E1B4B] font-bold text-sm shadow-sm hover:border-slate-300 transition-all">
                <div className={`w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
