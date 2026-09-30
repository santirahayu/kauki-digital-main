import React, { useState } from 'react';
import { marked } from 'marked';
import { X, Calendar, Clock, Eye, MessageSquare, Check, Copy, Rocket } from 'lucide-react';

export default function ArticleReaderModal({ article, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const parsedHTML = marked.parse(article.content || '');

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-[#1E1B4B]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-purple-100 relative">
        
        {/* Sticky Modal Close Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-purple-100 flex items-center justify-between">
          <span className="text-xs font-bold text-secondary bg-accent px-3 py-1 rounded-full uppercase tracking-wider">
            {article.category}
          </span>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1E1B4B] flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Header */}
          <div className="space-y-4 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-black text-[#1E1B4B] leading-tight">
              {article.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 pt-2 border-t border-purple-100">
              <div className="flex items-center gap-2">
                <img src={article.author_avatar} alt={article.author} className="w-8 h-8 rounded-full object-cover border border-purple-200" />
                <span className="font-bold text-[#1E1B4B]">{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>{article.read_time || '5 menit baca'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>{(article.views || 0) + 1} views</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-2xl overflow-hidden shadow-md border border-purple-100 max-h-[380px] bg-slate-100">
            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          {/* Prose Content */}
          <div 
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: parsedHTML }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-purple-100 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Topik:</span>
              {article.tags.map((t, idx) => (
                <span key={idx} className="text-xs bg-accent text-secondary px-3 py-1 rounded-full font-bold">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Share & Consultation CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-[#1E1B4B] mb-1">Tertarik memiliki website seperti ini?</h4>
              <p className="text-xs text-slate-600">Konsultasikan kebutuhan bisnis Anda bersama tim Kauki Digital sekarang.</p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a 
                href={`https://wa.me/6283835782376?text=${encodeURIComponent('Halo Kauki Digital! Saya membaca artikel ' + article.title + '. Saya mau konsultasi website.')}`}
                target="_blank" 
                rel="noreferrer"
                className="btn-whatsapp text-xs font-bold py-2.5 px-5 rounded-full flex items-center justify-center gap-1.5 flex-1 sm:flex-none shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Konsultasi via WA</span>
              </a>
              <button 
                onClick={copyLink}
                className="p-2.5 rounded-full bg-white border border-purple-100 hover:bg-purple-50 text-[#1E1B4B] transition-colors"
                title="Salin Tautan"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-secondary" />}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
