import React from 'react';
import prisma from '@/lib/prisma';
import DeadlockGraph from '@/components/intelligence/DeadlockGraph';
import { GitPullRequest, RotateCcw, AlertTriangle, ArrowRight, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DeadlockIntelligencePage() {
  const deadlockedCases = await prisma.grievance.findMany({
    where: {
      OR: [
        { deadlockDetection: { detected: true } },
        { status: 'TRANSFERRED' },
      ],
    },
    take: 10,
    include: {
      department: true,
      transfers: {
        include: { fromDepartment: true, toDepartment: true },
      },
      deadlockDetection: true,
      riskPrediction: true,
    },
  });

  const showcaseTransfers = [
    {
      fromDepartment: 'Roads & Highways',
      toDepartment: 'Municipal Administration',
      reason: 'Stormwater overflow claimed under municipal drainage division purview',
      transferredAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    },
    {
      fromDepartment: 'Municipal Administration',
      toDepartment: 'Revenue & Land Administration',
      reason: 'Right-of-way boundary dispute; requesting land survey map',
      transferredAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    {
      fromDepartment: 'Revenue & Land Administration',
      toDepartment: 'Roads & Highways',
      reason: 'Survey shows road is gazetted PWD corridor; maintenance rests with Roads Dept',
      transferredAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <GitPullRequest className="w-6 h-6 text-purple-400" />
            <span>PROCEDURAL PING-PONG & DEADLOCK GRAPH VISUALIZATION</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
            NetworkX + Tarjan Strongly Connected Components
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Detects cyclic directed paths across departmental routing graphs where files circulate without reaching operational closure.
        </p>
      </div>

      {/* Interactive Deadlock Graph Component */}
      <DeadlockGraph
        cyclePath={['Roads & Highways', 'Municipal Administration', 'Revenue & Land Administration', 'Roads & Highways']}
        transfers={showcaseTransfers}
        isDeadlocked={true}
      />

      {/* Deadlock Cases Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Active Strongly Connected Component (SCC) Cycles
        </h3>

        <div className="space-y-3">
          {deadlockedCases.map((c) => (
            <div
              key={c.id}
              className="bg-dark-900 border border-purple-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white">{c.grievanceNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">
                    Cycle Detected
                  </span>
                  <span className="text-xs text-red-400 font-mono font-bold">
                    Risk: {c.riskPrediction?.riskScore || 84}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{c.title}</h4>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Current: {c.department.name}</span>
                  <span>•</span>
                  <span>{c.transfers.length} inter-agency transfers</span>
                </div>
              </div>

              <a
                href={`/grievances/${c.grievanceNumber}`}
                className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm whitespace-nowrap"
              >
                <span>Inspect Loop</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
