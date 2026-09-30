import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export default function Comparison() {
  return (
    <section id="why-us" className="py-24 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-secondary bg-accent px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Perbandingan Kualitas
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B]">
            Kenapa Memilih Kauki Digital?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Lihat perbandingan nyata antara standar pengerjaan kami dengan opsi lainnya di pasaran.
          </p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 uppercase text-xs border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 font-bold">Fitur & Kualitas</th>
                  <th className="py-4 px-6 text-primary font-extrabold bg-blue-50/50">Kauki Digital 🌟</th>
                  <th className="py-4 px-6 text-slate-500 font-normal">Freelancer Lepas</th>
                  <th className="py-4 px-6 text-slate-500 font-normal">Bikin Sendiri (DIY)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#1E1B4B]">Desain Eksklusif & Modern</td>
                  <td className="py-4 px-6 text-emerald-600 font-bold bg-blue-50/30 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" /> Custom & Mobile-First
                  </td>
                  <td className="py-4 px-6 text-slate-500">Tergantung pengalaman</td>
                  <td className="py-4 px-6 text-red-500 flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Template kaku & pasaran
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#1E1B4B]">Garansi & Support </td>
                  <td className="py-4 px-6 text-emerald-600 font-bold bg-blue-50/30 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" /> Support Cepat 
                  </td>
                  <td className="py-4 px-6 text-amber-600">Sering sulit dihubungi</td>
                  <td className="py-4 px-6 text-red-500 flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Bingung sendiri jika error
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#1E1B4B]">Kecepatan Pengerjaan</td>
                  <td className="py-4 px-6 text-emerald-600 font-bold bg-blue-50/30 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" /> 5-10 Hari Kerja 
                  </td>
                  <td className="py-4 px-6 text-slate-500">Tidak tentu</td>
                  <td className="py-4 px-6 text-slate-500">Bisa berbulan-bulan</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#1E1B4B]">Fondasi SEO & Speed Web</td>
                  <td className="py-4 px-6 text-emerald-600 font-bold bg-blue-50/30 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" /> Sudah di optimasi
                  </td>
                  <td className="py-4 px-6 text-slate-500">Jarang dioptimasi</td>
                  <td className="py-4 px-6 text-red-500 flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Sering lambat & berat di HP
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-[#1E1B4B]">Domain & Email Bisnis</td>
                  <td className="py-4 px-6 text-emerald-600 font-bold bg-blue-50/30 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" /> Dibereskan Sampai Aktif
                  </td>
                  <td className="py-4 px-6 text-slate-500">Biaya setup tambahan</td>
                  <td className="py-4 px-6 text-red-500 flex items-center gap-1.5">
                    <X className="w-4 h-4" /> Ribet atur DNS & record MX
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
