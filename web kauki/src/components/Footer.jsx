import React, { useState, useEffect } from 'react';
import { MessageSquare, Lock } from 'lucide-react';
import { dataService } from '../lib/storage';

export default function Footer({ onOpenAdmin }) {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      const stg = await dataService.getSettings();
      setSiteSettings(stg);
    };
    loadSettings();
  }, []);

  const waNumber = siteSettings?.whatsapp_number || '6283835782376';
  const emailContact = siteSettings?.email_contact || 'halo@kaukidigital.com';

  return (
    <footer className="bg-[#1E1B4B] border-t border-purple-900/50 text-slate-300 text-xs sm:text-sm py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-3">
              <img src="/logo.png" alt="Kauki Digital" className="h-14 w-14 rounded bg-white object-contain" />
            </a>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Partner terpercaya transformasi digital & pembuatan website modern di Indonesia. Membantu bisnis tumbuh lebih cepat dengan teknologi terkini.
            </p>

            <div className="pt-1">
              <span className="text-[11px] bg-white/10 text-purple-200 border border-white/15 px-3 py-1 rounded-full font-bold">
                🇮🇩 Made for Indonesian Businesses
              </span>
            </div>
          </div>

          {/* Nav 1 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Layanan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">Landing Page UMKM</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Company Profile</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Toko Online & Katalog</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Domain & Email Bisnis</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Optimasi SEO & Google</a></li>
            </ul>
          </div>

          {/* Nav 2 */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">Pilihan Paket</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Kalkulator Biaya</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Portofolio Klien</a></li>
              <li><a href="#articles" className="hover:text-white transition-colors">Artikel & Edukasi</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Tanya Jawab (FAQ)</a></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Kontak Langsung</h4>
            <p className="text-xs text-slate-400">Konsultasi kebutuhan website Anda bersama tim konsultan kami:</p>
            <div className="space-y-2 pt-1">
              <a 
                href={`https://wa.me/${waNumber}?text=Halo%20Kauki%20Digital,%20saya%20tertarik%20konsultasi`} 
                target="_blank" 
                rel="noreferrer"
                className="btn-whatsapp text-xs font-bold py-2 px-4 rounded-full text-white inline-flex items-center gap-2 shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat WhatsApp Kami</span>
              </a>
              <p className="text-[11px] text-slate-400">Email: <strong className="text-slate-200">{emailContact}</strong></p>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Kauki Digital. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-200">Kebijakan Privasi</a>
            <a href="#" className="hover:text-slate-200">Syarat & Ketentuan</a>
            
            {/* Subtle discreet portal trigger for admin */}
            <button 
              onClick={onOpenAdmin} 
              className="text-slate-500 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
              title="Portal Akses Sistem (Shortcut: Ctrl + Shift + A)"
            >
              <Lock className="w-3 h-3" />
              <span>Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
