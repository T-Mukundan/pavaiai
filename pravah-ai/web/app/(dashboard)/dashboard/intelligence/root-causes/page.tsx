import React from 'react';
import prisma from '@/lib/prisma';
import { SearchCode, Sparkles, MapPin, Building2, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RootCausesPage() {
  const rootCauses = await prisma.rootCause.findMany({
    include: {
      department: true,
      location: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <SearchCode className="w-6 h-6 text-gold-400" />
            <span>CROSS-VECTOR ROOT-CAUSE ANALYTICS ENGINE</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
            Multi-Vector Correlation
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Synthesizes spatial density, semantic clustering, and bureaucratic graph cycles into hypothesized systemic failures.
        </p>
      </div>

      <div className="space-y-5">
        {rootCauses.map((rc) => (
          <div
            key={rc.id}
            className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-6 shadow-card-dark transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold">
                  Systemic Root-Cause Hypothesis
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{rc.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-dark-800 text-slate-300 font-mono text-xs font-bold border border-dark-700">
                  {rc.evidenceCount} Linked Complaints
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold">
                  {Math.round(rc.confidence * 100)}% Confidence
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-dark-950 p-4 rounded-xl border border-dark-800">
              {rc.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-dark-850 p-2.5 rounded border border-dark-750 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gold-400" />
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Responsible Entity</span>
                  <span className="font-semibold text-white">{rc.department?.name || 'Multi-Agency'}</span>
                </div>
              </div>

              <div className="bg-dark-850 p-2.5 rounded border border-dark-750 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Geographic Hotspot</span>
                  <span className="font-semibold text-white">{rc.location?.ward || 'Central Urban'}</span>
                </div>
              </div>

              <div className="bg-dark-850 p-2.5 rounded border border-dark-750 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Adjudication Status</span>
                  <span className="font-semibold text-emerald-400">{rc.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
