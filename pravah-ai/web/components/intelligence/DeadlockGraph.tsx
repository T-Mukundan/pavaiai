'use client';

import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';

interface TransferItem {
  fromDepartment: string;
  toDepartment: string;
  reason: string;
  transferredAt: string;
  fromOfficer?: string;
  toOfficer?: string;
}

interface DeadlockGraphProps {
  cyclePath: string[];
  transfers: TransferItem[];
  isDeadlocked: boolean;
}

export default function DeadlockGraph({ cyclePath, transfers, isDeadlocked }: DeadlockGraphProps) {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Default cycle for key showcase if not supplied
  const path = cyclePath.length > 0
    ? cyclePath
    : ['Roads & Highways', 'Municipal Administration', 'Revenue & Land Administration', 'Roads & Highways'];

  const uniqueDepts = Array.from(new Set(path));

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-dark-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>ROUTING GRAPH & TARJAN SCC DEADLOCK ANALYSIS</span>
            </h3>
            {isDeadlocked ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                JURISDICTIONAL DEADLOCK
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                LINEAR ROUTING
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Directed cyclic graph illustrating inter-departmental transfers and jurisdictional ping-pong loops.
          </p>
        </div>
      </div>

      {/* Visual Directed Loop Representation */}
      <div className="relative py-6 px-4 bg-dark-950 rounded-xl border border-dark-800 flex flex-col items-center justify-center my-4 overflow-hidden">
        {/* Background cycle glow */}
        {isDeadlocked && (
          <div className="absolute inset-0 bg-purple-900/10 pointer-events-none rounded-xl" />
        )}

        <div className="text-[11px] font-mono uppercase text-slate-500 mb-6 tracking-wider">
          {isDeadlocked ? '⚠️ Strongly Connected Component (Cycle Path Detected)' : 'Active Dispatch Sequence'}
        </div>

        {/* Directed Flow Steps */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-3xl z-10">
          {path.map((dept, idx) => {
            const isLastClosing = idx === path.length - 1 && isDeadlocked;
            const isHighlighted = selectedDept === dept;
            return (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-0.5 shadow-md ${
                    isLastClosing
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500 shadow-purple-glow'
                      : isHighlighted
                      ? 'bg-gold-500 text-black shadow-gold-glow'
                      : 'bg-dark-850 text-white border border-dark-750 hover:border-gold-500/50'
                  }`}
                >
                  <span className="text-[9px] font-mono opacity-60">Step {idx + 1}</span>
                  <span>{dept}</span>
                </button>

                {idx < path.length - 1 && (
                  <div className="flex items-center text-slate-600">
                    <ArrowRight className={`w-4 h-4 ${isDeadlocked ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {isDeadlocked && (
          <div className="mt-6 text-center text-xs text-purple-300 font-medium bg-purple-950/40 px-4 py-2 rounded-lg border border-purple-800/40">
            Detected 3 circular transfers returning complaint back to <strong className="text-white">Roads & Highways</strong> without physical resolution.
          </div>
        )}
      </div>

      {/* Chronological Transfer Ledger */}
      <div className="space-y-2 mt-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Recorded Inter-Departmental Transfers
        </h4>
        <div className="divide-y divide-dark-800 border border-dark-800 rounded-lg overflow-hidden bg-dark-950 text-xs">
          {transfers.length === 0 ? (
            <div className="p-3 text-slate-500 text-center">No transfers recorded for this grievance.</div>
          ) : (
            transfers.map((t, idx) => (
              <div key={idx} className="p-3 hover:bg-dark-900 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <span>{t.fromDepartment}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                    <span>{t.toDepartment}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Reason: <span className="text-slate-300">"{t.reason}"</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                  {new Date(t.transferredAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
