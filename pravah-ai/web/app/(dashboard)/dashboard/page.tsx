import React from 'react';
import SpotlightCard from '@/components/intelligence/SpotlightCard';
import KPICards from '@/components/dashboard/KPICards';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import prisma from '@/lib/prisma';
import { 
  ArrowUpRight, 
  AlertTriangle, 
  RotateCcw, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch top 6 recent high-priority or deadlocked grievances from SQLite
  let grievances: any[] = [];
  try {
    grievances = await prisma.grievance.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        department: true,
        location: true,
        riskPrediction: true,
        deadlockDetection: true,
      },
    });
  } catch (err) {
    console.error('Error loading grievances for dashboard:', err);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. TOP EDITORIAL HERO: INTELLIGENCE SPOTLIGHT (Matching User Design) */}
      <SpotlightCard />

      {/* 2. EXECUTIVE KPI CARDS */}
      <KPICards />

      {/* 3. INTERACTIVE RECHARTS ANALYTICS */}
      <AnalyticsCharts />

      {/* 4. ACTIVE INVESTIGATION QUEUE TABLE */}
      <section className="bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-dark-800">
          <div>
            <h3 className="text-base font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>PRIORITY INVESTIGATION QUEUE</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-dark-800 text-gold-400 border border-dark-700">
                Live Database Stream
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              High-risk cases flagged by ML for immediate administrative intervention.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/dashboard/grievances"
              className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 uppercase tracking-wider"
            >
              FULL INTAKE REPOSITORY <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-950 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-dark-800">
              <tr>
                <th className="py-3 px-4">Grievance ID</th>
                <th className="py-3 px-4">Title & Context</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Location / Ward</th>
                <th className="py-3 px-4 text-center">SLA Risk</th>
                <th className="py-3 px-4 text-center">Routing Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {grievances.map((g) => {
                const riskScore = g.riskPrediction?.riskScore || 50;
                const isDeadlocked = g.deadlockDetection?.detected;
                return (
                  <tr
                    key={g.id}
                    className="hover:bg-dark-850/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      <a href={`/grievances/${g.grievanceNumber}`} className="group-hover:text-gold-400">
                        {g.grievanceNumber}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-white truncate">{g.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{g.category}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-200 font-medium">{g.department?.name}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                      <div className="flex items-center gap-1 truncate max-w-[160px]">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span>{g.location?.ward || g.location?.district || 'Central Urban'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          riskScore >= 80
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-red-glow'
                            : riskScore >= 65
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {riskScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isDeadlocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase tracking-wider">
                          <RotateCcw className="w-3 h-3" /> Deadlock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700 text-[10px] uppercase">
                          {g.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <a
                        href={`/grievances/${g.grievanceNumber}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-400 hover:text-gold-300 border border-gold-500/30 hover:border-gold-500/60 bg-gold-500/10 px-2.5 py-1 rounded transition-all"
                      >
                        Examine <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
