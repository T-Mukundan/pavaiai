import React from 'react';
import AnalyticsCharts from '@/components/dashboard/AnalyticsCharts';
import { BarChart3, TrendingUp, Sparkles, Filter, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AnalyticsDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gold-400" />
            <span>PUBLIC GRIEVANCE INTELLIGENCE & PERFORMANCE ANALYTICS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Systemic operational trends, department velocity metrics, and AI predictive risk distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-dark-900 border border-dark-750 hover:border-gold-500/40 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
            <Download className="w-3.5 h-3.5 text-gold-400" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* Embedded Recharts Analytics Suite */}
      <AnalyticsCharts />

      {/* Deep Metric Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-dark-900 border border-dark-800 p-5 rounded-xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Average Resolution Velocity</span>
          <div className="text-2xl font-display font-black text-white">4.8 Business Days</div>
          <p className="text-xs text-slate-400">
            Down from 11.2 days before procedural ping-pong deadlock detection was enabled.
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 p-5 rounded-xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Early SLA Breach Interventions</span>
          <div className="text-2xl font-display font-black text-emerald-400">74 Cases Salvaged</div>
          <p className="text-xs text-slate-400">
            Nodal escalations triggered at &gt;75% predicted risk prior to deadline expiration.
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 p-5 rounded-xl space-y-2">
          <span className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">Deadlock Loops Dissolved</span>
          <div className="text-2xl font-display font-black text-purple-400">14 SCC Cycles Resolved</div>
          <p className="text-xs text-slate-400">
            Cross-departmental boundary disputes terminated by Nodal binding re-assignments.
          </p>
        </div>
      </div>
    </div>
  );
}
