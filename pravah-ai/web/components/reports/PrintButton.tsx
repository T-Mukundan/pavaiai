'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export default function PrintButton({
  label = 'Print / Export PDF Dossier',
  className = 'flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-gold-glow transition cursor-pointer',
}: PrintButtonProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button type="button" onClick={handlePrint} className={className}>
      <Printer className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
