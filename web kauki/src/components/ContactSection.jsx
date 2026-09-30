import React, { useState, useEffect } from 'react';
import { dataService } from '../lib/storage';
import { Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Landing Page UMKM',
    budget: 'Rp750rb - Rp1.5jt',
    message: ''
  });

  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const stg = await dataService.getSettings();
      setSiteSettings(stg);
    };
    loadSettings();
  }, []);

  const waNumber = siteSettings?.whatsapp_number || '6283835782376';
  const emailContact = siteSettings?.email_contact || 'halo@kaukidigital.com';
  const operatingHours = siteSettings?.operating_hours || 'Senin - Sabtu (08:00 - 17:00 WIB)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    try {
      await dataService.saveInquiry(formData);
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.7 }
      });
      setSubmitted(true);

      const waText = `Halo Kauki Digital! Saya ingin konsultasi proyek:\n\nNama: ${formData.name}\nEmail: ${formData.email}\nNo. HP: ${formData.phone}\nLayanan: ${formData.service}\nBudget: ${formData.budget}\n\nPesan:\n${formData.message}`;
      
      setTimeout(() => {
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`, '_blank');
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-white border-t border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#F8FAFC] p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl relative">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Column */}
            <div className="md:col-span-5 space-y-6">
              <span className="text-xs font-bold text-secondary bg-accent px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Konsultasi Tanpa Biaya
              </span>

              <h2 className="text-3xl font-extrabold text-[#1E1B4B] leading-tight">
                Siap Bawa Bisnis Anda ke Level Berikutnya?
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Ceritakan kebutuhan bisnis Anda. Tim kami akan memberikan saran struktur website dan strategi konversi yang paling tepat.
              </p>

              <div className="pt-2 space-y-3 text-xs sm:text-sm text-[#1E1B4B]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>WhatsApp: <strong>+{waNumber}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center border border-blue-200">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>Email: <strong>{emailContact}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-secondary flex items-center justify-center border border-purple-200">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>Jam Respon: <strong>{operatingHours}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1E1B4B]">Pesan Anda Berhasil Terkirim!</h3>
                  <p className="text-slate-500 text-xs max-w-xs mx-auto">
                    Menghubungkan ke WhatsApp Kauki Digital... Jika tidak terbuka otomatis, klik tombol di bawah:
                  </p>
                  <a 
                    href={`https://wa.me/${waNumber}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-whatsapp inline-flex items-center gap-2 py-2.5 px-6 rounded-full text-xs font-bold text-white mt-2"
                  >
                    Buka WhatsApp Sekarang
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Nama Lengkap *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1E1B4B] placeholder-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Email *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1E1B4B] placeholder-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] mb-1">No. WhatsApp *</label>
                      <input 
                        type="tel" 
                        placeholder="08123456789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1E1B4B] placeholder-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Layanan yang Dicari</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1E1B4B] focus:bg-white focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="Landing Page UMKM">Landing Page UMKM</option>
                        <option value="Company Profile">Company Profile</option>
                        <option value="Toko Online & E-Commerce">Toko Online & E-Commerce</option>
                        <option value="Domain & Email Bisnis">Domain & Email Bisnis</option>
                        <option value="Custom Web App">Custom Web App</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Perkiraan Budget</label>
                      <select 
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1E1B4B] focus:bg-white focus:border-primary focus:outline-none transition-colors"
                      >
                        <option value="Rp750rb - Rp1.5jt">Rp750rb - Rp1.5jt</option>
                        <option value="Rp1.5jt - Rp3jt">Rp1.5jt - Rp3jt</option>
                        <option value="Di atas Rp3jt">Di atas Rp3jt</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E1B4B] mb-1">Deskripsi Kebutuhan Anda *</label>
                    <textarea 
                      rows="3" 
                      required
                      placeholder="Contoh: Saya punya klinik gigi dan ingin punya website booking jadwal pasien..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#1E1B4B] placeholder-slate-400 focus:bg-white focus:border-primary focus:outline-none transition-colors"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full py-3.5 rounded-full text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Mengirim...' : 'Kirim & Konsultasi ke WhatsApp'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
