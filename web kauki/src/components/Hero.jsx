import React, { useState, useEffect } from 'react';
import { Calculator, MessageSquare, TrendingUp, Gauge, Sparkles } from 'lucide-react';
import { dataService } from '../lib/storage';

export default function Hero() {
  const [waNumber, setWaNumber] = useState('6283835782376');

  useEffect(() => {
    const loadSettings = async () => {
      const stg = await dataService.getSettings();
      if (stg?.whatsapp_number) setWaNumber(stg.whatsapp_number);
    };
    loadSettings();
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center pt-32 pb-16 overflow-hidden bg-gradient-subtle">
      {/* Background Ambient Circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-r from-blue-200/40 via-purple-200/30 to-indigo-200/40 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-accent border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Solusi Transformasi Digital & Website UMKM Indonesia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E1B4B] tracking-tight leading-[1.15]">
              Website Profesional yang siap membantu <span className="text-gradient-primary">pertumbuhan bisnis Anda.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Tingkatkan omzet bisnis Anda dengan Landing Page cepat, domain resmi, dan email bisnis profesional. Kami urus seluruh teknisnya, terima beres, siap jualan dalam 3-5 hari kerja.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <a 
                href="#calculator" 
                className="btn-primary py-3.5 px-7 rounded-full text-white font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Hitung Estimasi Biaya</span>
              </a>
              <a 
                href={`https://wa.me/${waNumber}?text=Halo%20Kauki%20Digital,%20saya%20mau%20konsultasi%20pembuatan%20website`} 
                target="_blank" 
                rel="noreferrer"
                className="btn-secondary py-3.5 px-7 rounded-full font-bold flex items-center justify-center gap-2 text-sm text-[#1E1B4B] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span>Konsultasi Gratis</span>
              </a>
            </div>

            {/* Proof Metric Counters */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-black text-[#1E1B4B]">99.8%</p>
                <p className="text-xs text-slate-500 font-semibold">Uptime & Speed</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#1E1B4B]">5-10 Hari</p>
                <p className="text-xs text-slate-500 font-semibold">Proses Pengerjaan</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600">100%</p>
                <p className="text-xs text-slate-500 font-semibold">Garansi Kepuasan</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="clean-card p-3 shadow-2xl border-slate-200 relative transform hover:rotate-0 transition-transform duration-500 bg-white">
              <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                
                {/* Browser Header Bar */}
                <div className="bg-slate-50 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="bg-white px-3 py-1 rounded text-[11px] text-slate-500 font-mono flex-1 text-center truncate border border-slate-200">
                    https://brand-anda.com
                  </div>
                </div>

                {/* Dashboard Image */}
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                  alt="Kauki Digital Preview" 
                  className="w-full h-72 sm:h-80 object-cover" 
                />

                {/* In-Card Floating Stats */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-semibold">Pertumbuhan Klien</p>
                      <p className="text-sm font-bold text-[#1E1B4B]">lebih meningkat</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded border border-emerald-200">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Floating PageSpeed Badge */}
            <div className="absolute -top-6 -right-6 bg-white p-3.5 rounded-2xl animate-float hidden sm:flex items-center gap-3 border border-slate-200 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-accent text-secondary flex items-center justify-center font-bold">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">Google PageSpeed</p>
                <p className="text-sm font-bold text-[#1E1B4B]">99 / 100 Kilat</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
