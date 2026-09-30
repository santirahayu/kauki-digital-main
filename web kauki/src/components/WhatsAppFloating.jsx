import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { dataService } from '../lib/storage';

export default function WhatsAppFloating() {
  const [waNumber, setWaNumber] = useState('6283835782376');

  useEffect(() => {
    const loadSettings = async () => {
      const stg = await dataService.getSettings();
      if (stg?.whatsapp_number) setWaNumber(stg.whatsapp_number);
    };
    loadSettings();
  }, []);

  return (
    <a
      href={`https://wa.me/${waNumber}?text=Halo%20Kauki%20Digital,%20saya%20ingin%20konsultasi%20website`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-full shadow-2xl shadow-emerald-500/40 transform hover:scale-105 active:scale-95 transition-all"
    >
      <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping -z-10"></span>
      <MessageSquare className="w-5 h-5 fill-current" />
      <span className="hidden sm:inline">Chat WhatsApp Kami</span>
    </a>
  );
}
