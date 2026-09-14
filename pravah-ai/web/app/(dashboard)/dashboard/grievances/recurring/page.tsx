import React from 'react';
import prisma from '@/lib/prisma';
import { Network, SearchCode, ArrowUpRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RecurringClustersPage() {
  const clusters = await prisma.semanticCluster.findMany({
    orderBy: { complaintCount: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-gold-400" />
            <span>SEMANTIC DUPLICATE & RECURRING COMPLAINT CLUSTERS</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
            HuggingFace all-MiniLM-L6-v2 (384-dim)
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Identifies disparate citizen complaints reporting the same underlying civic breakdown even when written in completely different phrasing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clusters.map((c) => (
          <div
            key={c.id}
            className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-5 shadow-card-dark transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  {c.category}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-dark-800 text-slate-200 border border-dark-700">
                  {c.complaintCount} Related Reports
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-tight">
                {c.name}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed bg-dark-950 p-3 rounded-lg border border-dark-800 mb-4">
                {c.description}
              </p>
            </div>

            <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                Cosine Similarity: <strong className="text-emerald-400">&gt;0.88</strong>
              </span>
              <a
                href="/dashboard/intelligence/clusters"
                className="flex items-center gap-1 font-bold text-gold-400 hover:text-gold-300 uppercase"
              >
                Inspect Semantic Group <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
