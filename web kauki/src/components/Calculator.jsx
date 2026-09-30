import React, { useState } from 'react';
import { Globe, Building2, ShoppingBag, Check, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Calculator() {
  const [selectedService, setSelectedService] = useState({
    id: 'landing',
    name: 'Landing Page Premium',
    price: 750000,
    desc: '1 Halaman fokus jualan & konversi chat WhatsApp'
  });

  const [selectedAddons, setSelectedAddons] = useState([]);

  const baseServices = [
    {
      id: 'landing',
      name: 'Landing Page',
      price: 750000,
      icon: Globe,
      desc: 'Fokus 1 produk/jasa, chat WA langsung.',
      tag: 'Cepat & Hemat'
    },
    {
      id: 'company',
      name: 'Website Profesional',
      price: 2500000,
      icon: Building2,
      desc: '3-5 Halaman lengkap (Home, Tentang, Layanan, Portofolio, Kontak).',
      tag: 'Kredibilitas'
    },
    {
      id: 'ecommerce',
      name: 'Katalog & Toko Online',
      price: 3500000,
      icon: ShoppingBag,
      desc: 'Katalog produk dinamis, filter kategori & checkout WhatsApp.',
      tag: 'Siap Jualan'
    }
  ];

  const addonsList = [
    {
      id: 'domain',
      name: 'Domain Kustom (.com / .id)',
      price: 350000,
      desc: 'Termasuk DNS setup'
    },
    {
      id: 'email',
      name: 'Email Bisnis (5 Akun)',
      price: 350000,
      desc: 'nama@bisnisanda.com anti-spam siap sinkron di HP & laptop'
    },
    {
      id: 'seo',
      name: 'Hosting (Start 1GB)',
      price: 400000,
      desc: 'Termasuk DNS setup & sertifikat SSL enkripsi HTTPS resmi'
    },
    {
      id: 'copywriting',
      name: 'Copywriting & Desain Banner',
      price: 300000,
      desc: 'Penulisan kata penawaran persuasif yang memikat pembeli'
    }
  ];

  const toggleAddon = (addon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const totalPrice = selectedService.price + selectedAddons.reduce((sum, a) => sum + a.price, 0);

  const handleOrder = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });

    const addonNames = selectedAddons.length > 0 
      ? selectedAddons.map(a => `- ${a.name}`).join('\n') 
      : '- Tanpa add-on tambahan';

    const text = `Halo Kauki Digital! Saya ingin pesan estimasi paket website:\n\n*Layanan Utama:* ${selectedService.name} (Rp${selectedService.price.toLocaleString('id-ID')})\n*Add-on Pilihan:*\n${addonNames}\n\n*Total Estimasi:* Rp${totalPrice.toLocaleString('id-ID')}\n\nBisa dibantu untuk langkah selanjutnya?`;
    
    window.open(`https://wa.me/6283835782376?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="calculator" className="py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-secondary bg-accent px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
            Kalkulator Transparan
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E1B4B]">
            Simulasi Biaya & Kebutuhan Proyek Anda
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Pilih paket utama dan fitur tambahan yang Anda perlukan. Dapatkan estimasi harga instan dan penawaran langsung tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Calculator Box */}
        <div className="bg-[#F8FAFC] p-6 sm:p-10 max-w-4xl mx-auto rounded-3xl border border-slate-200 shadow-xl">
          
          {/* Step 1: Base Service */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[#1E1B4B] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
              Pilih Jenis Website Utama:
            </h3>

            <div className="grid sm:grid-cols-3 gap-4">
              {baseServices.map((srv) => {
                const Icon = srv.icon;
                const isSelected = selectedService.id === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-white border-primary shadow-lg shadow-blue-500/10 ring-2 ring-primary/20' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-accent text-secondary' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider block mb-1">{srv.tag}</span>
                    <h4 className="font-bold text-[#1E1B4B] text-base mb-1">{srv.name}</h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{srv.desc}</p>
                    <p className="text-base font-black text-transparent bg-clip-text bg-gradient-brand">
                      Rp{srv.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Add-ons */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[#1E1B4B] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</span>
              Pilih Add-on & Fitur Tambahan (Opsional):
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              {addonsList.map((addon) => {
                const isChecked = selectedAddons.some(a => a.id === addon.id);
                return (
                  <label
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      isChecked 
                        ? 'bg-white border-primary shadow-sm ring-1 ring-primary/20' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${isChecked ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-[#1E1B4B]">{addon.name}</p>
                      <p className="text-[11px] text-slate-500 leading-snug">{addon.desc}</p>
                    </div>
                    <span className="text-xs font-bold text-secondary whitespace-nowrap">
                      +Rp{addon.price.toLocaleString('id-ID')}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Total Box */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <p className="text-xs text-slate-500">
                Paket: <strong className="text-[#1E1B4B]">{selectedService.name}</strong>
                {selectedAddons.length > 0 && ` + ${selectedAddons.map(a => a.name).join(', ')}`}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs uppercase font-bold text-slate-500">Total Estimasi:</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-brand">
                  Rp{totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Garansi revisi & panduan penggunaan
              </p>
            </div>

            <button
              onClick={handleOrder}
              className="btn-whatsapp py-3.5 px-8 rounded-full text-white font-bold text-sm w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Rocket className="w-4 h-4" />
              <span>Pesan Paket Ini Sekarang</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
