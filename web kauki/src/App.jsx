import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustMetrics from './components/TrustMetrics';
import Services from './components/Services';
import Calculator from './components/Calculator';
import Portfolio from './components/Portfolio';
import ArticlesSection from './components/ArticlesSection';
import Comparison from './components/Comparison';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import ArticleReaderModal from './components/ArticleReaderModal';
import AdminModal from './components/AdminModal';
import { dataService } from './lib/storage';

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);

  useEffect(() => {
    // 1. Check URL Hash #admin or search query
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // 2. Secret Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenArticle = (art) => {
    setSelectedArticle(art);
    if (art && art.slug) {
      dataService.incrementViews(art.slug);
    }
  };

  const handleDataChange = () => {
    setDataRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E1B4B] flex flex-col justify-between selection:bg-purple-500 selection:text-white relative">
      
      {/* Top Navbar */}
      <Navbar onOpenAdmin={() => setAdminOpen(true)} />

      {/* Main Single-Page Sections */}
      <main className="flex-1">
        <Hero />
        <TrustMetrics />
        <Services refreshTrigger={dataRefreshTrigger} />
        <Calculator />
        <Portfolio refreshTrigger={dataRefreshTrigger} />
        <ArticlesSection 
          onOpenArticle={handleOpenArticle} 
          refreshTrigger={dataRefreshTrigger}
        />
        <Comparison />
        <FAQ />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      {/* Floating Interactive WhatsApp Widget */}
      <WhatsAppFloating />

      {/* In-Page Article Reading Modal */}
      <ArticleReaderModal 
        article={selectedArticle} 
        onClose={() => setSelectedArticle(null)} 
      />

      {/* Secure Enterprise Admin CMS & CRM Modal */}
      <AdminModal 
        isOpen={adminOpen} 
        onClose={() => {
          setAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, null, ' ');
          }
        }} 
        onDataChange={handleDataChange}
      />
    </div>
  );
}
