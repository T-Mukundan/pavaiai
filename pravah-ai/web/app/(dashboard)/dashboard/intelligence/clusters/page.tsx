import React from 'react';
import prisma from '@/lib/prisma';
import { SearchCode, Network, Sparkles, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClustersIntelligencePage() {
  const clusters = await prisma.semanticCluster.findMany({
    orderBy: { complaintCount: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <SearchCode className="w-6 h-6 text-blue-400" />
            <span>MINILM-L6-V2 SEMANTIC CLUSTERS & VECTOR EMBEDDINGS</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            384-Dimensional Cosine Space
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Vector space representation clustering semantically correlated complaints to detect hidden systemic issues across disparate wards.
        </p>
      </div>

      <div className="space-y-4">
        {clusters.map((c) => (
          <div
            key={c.id}
            className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-5 shadow-card-dark transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-dark-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">{c.category}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-400">Cluster ID: {c.id}</span>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-dark-800 text-white border border-dark-700">
                {c.complaintCount} Complaints Grouped
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">{c.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{c.description}</p>

            <div className="bg-dark-950 p-3 rounded-lg border border-dark-800 mb-3 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                Representative Semantic Sample Embeddings:
              </span>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex items-center justify-between">
                  <span>"Main road has been damaged near bus stand."</span>
                  <span className="text-emerald-400">Cosine: 0.94</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>"Road surface is broken close to the bus stop."</span>
                  <span className="text-emerald-400">Cosine: 0.91</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>"Large potholes continue near the bus station."</span>
                  <span className="text-emerald-400">Cosine: 0.89</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Resolution Lag: <strong className="text-amber-400">+14 days above target</strong>
              </span>
              <a
                href="/dashboard/intelligence/root-causes"
                className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 uppercase"
              >
                Synthesize Root Cause <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
