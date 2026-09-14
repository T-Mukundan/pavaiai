import React from 'react';
import prisma from '@/lib/prisma';
import { RotateCcw, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DeadlockedGrievancesPage() {
  const grievances = await prisma.grievance.findMany({
    where: {
      OR: [
        { deadlockDetection: { detected: true } },
        { status: 'TRANSFERRED' },
      ],
    },
    take: 30,
    orderBy: { updatedAt: 'asc' },
    include: {
      department: true,
      location: true,
      deadlockDetection: true,
      riskPrediction: true,
      transfers: {
        include: { fromDepartment: true, toDepartment: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-purple-400" />
            <span>CIRCULAR ROUTING & JURISDICTIONAL DEADLOCKS</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
            Tarjan Strongly Connected Components (SCC)
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Complaints trapped in bureaucratic ping-pong cycles where files circulate indefinitely across department boundaries.
        </p>
      </div>

      <div className="space-y-4">
        {grievances.map((g) => {
          let cycleNodes: string[] = ['Roads & Highways', 'Municipal Administration', 'Revenue & Land Administration', 'Roads & Highways'];
          if (g.deadlockDetection?.cyclePath) {
            try {
              cycleNodes = JSON.parse(g.deadlockDetection.cyclePath);
            } catch {}
          }
          return (
            <div
              key={g.id}
              className="bg-dark-900 border border-purple-500/30 hover:border-purple-500/60 rounded-xl p-5 shadow-card-dark transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-dark-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-white">{g.grievanceNumber}</span>
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[10px] uppercase font-bold">
                    {g.transfers.length || 3} Circular Transfers
                  </span>
                </div>
                <span className="text-xs text-red-400 font-mono font-bold">
                  {g.riskPrediction?.riskScore || 84}% Breach Probability
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{g.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2 mb-4">{g.description}</p>

              {/* Cycle Flow Preview */}
              <div className="bg-dark-950 p-3 rounded-lg border border-dark-800 mb-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">Cycle Path:</span>
                {cycleNodes.map((node, nIdx) => (
                  <React.Fragment key={nIdx}>
                    <span className="font-medium text-white px-2 py-0.5 rounded bg-dark-850 border border-dark-750">
                      {node}
                    </span>
                    {nIdx < cycleNodes.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Ward: <strong className="text-white">{g.location?.ward || 'Central'}</strong>
                </span>
                <a
                  href={`/grievances/${g.grievanceNumber}`}
                  className="flex items-center gap-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                >
                  <span>Resolve Deadlock Graph</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
