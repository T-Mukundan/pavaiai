'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center font-display font-black text-black text-2xl shadow-gold-glow animate-pulse">
        P
      </div>
      <p className="mt-4 text-xs font-mono text-slate-400">Loading PRAVAH-AI Intelligence Platform...</p>
      <a href="/dashboard" className="mt-2 text-xs text-gold-400 hover:underline">
        Click here if not redirected automatically
      </a>
    </div>
  );
}
