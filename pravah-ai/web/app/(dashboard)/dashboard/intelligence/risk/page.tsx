import React from 'react';
import prisma from '@/lib/prisma';
import ShapWaterfall from '@/components/intelligence/ShapWaterfall';
import { BrainCircuit, AlertTriangle, Sparkles, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RiskIntelligencePage() {
  const highRiskCases = await prisma.grievance.findMany({
    where: {
      riskPrediction: { riskScore: { gte: 70 } },
    },
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: {
      department: true,
      riskPrediction: true,
      riskExplanations: { orderBy: { rank: 'asc' } },
    },
  });

  const showcaseContributors = [
    { feature: 'Reassignment / Transfer Count (3 transfers)', contribution: 21.0, rank: 1 },
    { feature: 'Inactivity Duration (18 days stalled)', contribution: 19.0, rank: 2 },
    { feature: 'Assigned Officer Workload Ratio (126% load)', contribution: 16.0, rank: 3 },
    { feature: 'Department Backlog Volume (Roads Dept: 210)', contribution: 13.0, rank: 4 },
    { feature: 'Category Historical Turnaround Lag', contribution: 8.0, rank: 5 },
    { feature: 'Geographic High-Density Hotspot Factor', contribution: 7.0, rank: 6 },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-gold-400" />
            <span>SLA RISK PREDICTION & EXPLAINABLE AI (XAI)</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
            LightGBM + TreeSHAP
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Machine learning risk engine evaluating 10 operational features to forecast SLA breaches and explain attribution weights.
        </p>
      </div>

      {/* Global SHAP Waterfall Feature Model */}
      <ShapWaterfall contributors={showcaseContributors} riskScore={84} />

      {/* High Risk Cases Grid with Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Cases with Highest Predicted Breach Probability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highRiskCases.map((c) => {
            const risk = c.riskPrediction?.riskScore || 75;
            return (
              <div
                key={c.id}
                className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-4 shadow-card-dark flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs font-bold text-white">{c.grievanceNumber}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                      {risk}% RISK
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-2 line-clamp-1">{c.title}</h4>

                  <div className="space-y-1 text-[11px] text-slate-300 bg-dark-950 p-2.5 rounded border border-dark-800 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dept:</span>
                      <span className="font-medium text-white">{c.department.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Top Factor:</span>
                      <span className="text-red-400 font-medium truncate max-w-[140px]">
                        {c.riskExplanations[0]?.feature || 'Reassignment Count'}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={`/grievances/${c.grievanceNumber}`}
                  className="w-full flex items-center justify-center gap-1 bg-dark-850 hover:bg-dark-800 text-gold-400 border border-dark-750 hover:border-gold-500/40 py-1.5 rounded text-xs font-bold transition"
                >
                  <span>Inspect XAI Attribution</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
