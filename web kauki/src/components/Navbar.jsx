import React, { useState, useEffect } from 'react';
import { MessageSquare, Menu, X, Shield, Lock } from 'lucide-react';
import { dataService } from '../lib/storage';

export default function Navbar({ onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const loadNavData = async () => {
      const stg = await dataService.getSettings();
      setSiteSettings(stg);
    };
    loadNavData();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waNumber = siteSettings?.whatsapp_number || '6283835782376';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-purple-100 py-3 shadow-sm' : 'py-4 bg-white/80 backdrop-blur-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Kauki Digital" className="h-14 w-14 object-contain transition-transform group-hover:scale-105" />
        </a>

        {/* In-Page Navigation Menu */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <a href="#services" className="hover:text-secondary transition-colors">Layanan</a>
          <a href="#calculator" className="hover:text-secondary transition-colors flex items-center gap-1">
            <span>Kalkulator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          </a>
          <a href="#portfolio" className="hover:text-secondary transition-colors flex items-center gap-1.5">
            <span>Portofolio</span>
            
          </a>
          <a href="#articles" className="hover:text-secondary transition-colors flex items-center gap-1.5">
            <span>Artikel & Blog</span>
            <span className="text-[10px] bg-accent text-secondary font-bold px-2 py-0.5 rounded-full">Baru</span>
          </a>
          <a href="#why-us" className="hover:text-secondary transition-colors">Keunggulan</a>
          <a href="#faq" className="hover:text-secondary transition-colors">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Dedicated Portal Admin Button */}
          <button 
            onClick={onOpenAdmin}
            className="text-xs font-bold text-[#1E1B4B] hover:text-secondary flex items-center gap-1.5 py-2.5 px-4 rounded-full border border-purple-200/80 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
            title="Masuk ke Portal Admin CMS"
          >
            <Lock className="w-3.5 h-3.5 text-secondary" />
            <span>Portal Admin</span>
          </button>

          <a 
            href={`https://wa.me/${waNumber}?text=Halo%20Kauki%20Digital,%20saya%20tertarik%20untuk%20konsultasi%20pembuatan%20website`} 
            target="_blank" 
            rel="noreferrer"
            className="btn-whatsapp text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-2 text-white shadow-md shadow-emerald-500/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Konsultasi Gratis</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#1E1B4B] hover:text-primary p-2"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-white/98 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between md:hidden border-t border-purple-100 shadow-2xl animate-fadeIn">
          <nav className="flex flex-col gap-5 text-base font-bold text-[#1E1B4B]">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-secondary">Layanan & Paket</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="hover:text-secondary">Kalkulator Biaya Proyek</a>
            <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="text-secondary flex items-center justify-between">
              <span>Portofolio & Studi Kasus</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold py-0.5 px-2.5 rounded-full">Live Proyek</span>
            </a>
            <a href="#articles" onClick={() => setMobileMenuOpen(false)} className="hover:text-secondary">Blog & Artikel Bisnis</a>
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="hover:text-secondary">Keunggulan Kami</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-secondary">Tanya Jawab (FAQ)</a>
            
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="text-left text-secondary flex items-center gap-2 text-sm pt-4 border-t border-purple-100 font-bold cursor-pointer"
            >
              <Shield className="w-4 h-4 text-secondary" />
              <span>Buka Portal Admin CMS</span>
            </button>
          </nav>

          <div className="pt-6 border-t border-purple-100">
            <a 
              href={`https://wa.me/${waNumber}?text=Halo%20Kauki%20Digital,%20saya%20tertarik%20konsultasi%20website`} 
              target="_blank" 
              rel="noreferrer"
              className="btn-whatsapp w-full justify-center py-3.5 rounded-full flex items-center gap-2 font-bold text-white shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat WhatsApp Kami</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
