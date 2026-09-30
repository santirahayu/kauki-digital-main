import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Berapa lama proses pembuatan website hingga selesai?',
      a: 'Rata-rata untuk Landing Page selesai dalam 5 hingga 10 hari kerja setelah materi konten dan logo kami terima. Untuk Company Profile lengkap akan menyesuaikan kompleksitas.'
    },
    {
      q: 'Apakah saya perlu mengerti bahasa pemrograman atau coding?',
      a: 'Sama sekali tidak perlu! Tim Kauki Digital mengurus seluruh proses teknis mulai dari pemilihan domain, server hosting, desain visual, hingga optimasi responsif di HP. Anda cukup memberikan detail bisnis Anda dan terima jadi.'
    },
    {
      q: 'Bagaimana jika saya belum punya logo atau tulisan konten?',
      a: 'Jangan khawatir! Tim kami siap membantu menyusun kata-kata penawaran (copywriting) yang persuasif dan memilih foto-foto berkualitas tinggi yang relevan dengan bidang usaha Anda.'
    },
    {
      q: 'Bagaimana metode dan termin pembayaran?',
      a: 'Kami menerima pembayaran melalui Transfer Bank serta QRIS. Kami memberlakukan skema DP 50% di awal dan pelunasan 50% setelah website selesai direview dan Anda puas.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold text-secondary bg-accent px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Pertanyaan Populer
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B]">
            Paling Sering Ditanyakan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Semua yang perlu Anda ketahui sebelum memulai kerja sama dengan Kauki Digital.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                  isOpen ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-[#1E1B4B] text-sm sm:text-base">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
