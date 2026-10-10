'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, ArrowRightLeft } from 'lucide-react';

export default function OfficerRebalanceBanner() {
  const [rebalanced, setRebalanced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRebalance = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRebalanced(true);
    }, 600);
  };

  return (
    <div className="bg-dark-900 border-l-4 border-amber-500 p-4 rounded-r-xl border-y border-r border-dark-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-card-dark">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-bold uppercase tracking-wider block mb-0.5">
            AI Workload Redistribution Recommendation
          </strong>
          {rebalanced ? (
            <span className="text-emerald-300 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
              <span>
                Optimal redistribution applied! 4 cases successfully reallocated: Vikram Malhotra load reduced from 126% to 95%. Aditya Sen updated to 78%.
              </span>
            </span>
          ) : (
            <span className="text-slate-300">
              Senior Executive Engineer <strong className="text-gold-400">Vikram Malhotra (126% load)</strong> is currently over capacity with 25 active cases, while <strong>Aditya Sen (58% load)</strong> and <strong>Tanvi Saxena (44% load)</strong> possess surplus bandwidth. Reallocating 4 pending non-critical road inquiries will normalize divisional turnaround.
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={loading || rebalanced}
        onClick={handleRebalance}
        className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-gold-glow flex items-center gap-1.5 cursor-pointer ${
          rebalanced
            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
            : 'bg-gold-500 hover:bg-gold-400 text-black active:scale-95'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Simulating...</span>
          </>
        ) : rebalanced ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rebalanced ✓</span>
          </>
        ) : (
          <>
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Initiate Rebalance</span>
          </>
        )}
      </button>
    </div>
  );
}
