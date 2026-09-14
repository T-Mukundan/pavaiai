import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  ArrowUpRight, 
  Flame, 
  RotateCcw, 
  Users, 
  Camera, 
  AlertTriangle, 
  BrainCircuit 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ReportsCenterPage() {
  const reportsList = [
    {
      title: 'Municipal Backlog & Operational Queue Audit',
      description: 'Comprehensive census of 347 active grievances across 25 municipal divisions with age profiling and inactivity logs.',
      category: 'OPERATIONAL',
      icon: FileSpreadsheet,
      badge: 'Daily',
      link: '/dashboard/grievances',
    },
    {
      title: 'Department Velocity & SLA Compliance Charter',
      description: 'Turnaround benchmarks, target hour performance, and division-by-division breach rates.',
      category: 'PERFORMANCE',
      icon: BrainCircuit,
      badge: 'Weekly',
      link: '/dashboard/analytics',
    },
    {
      title: 'TreeSHAP High-Risk Predictive Early Warning Dossier',
      description: 'Ranked list of 86 grievances forecasting high probability of breaching citizen charters.',
      category: 'PREDICTIVE',
      icon: AlertTriangle,
      badge: 'Realtime',
      link: '/dashboard/grievances/high-risk',
    },
    {
      title: 'Procedural Deadlock & Circular Ping-Pong Audit',
      description: 'Tarjan SCC topological report detailing inter-agency files circulating in jurisdictional loops.',
      category: 'INTELLIGENCE',
      icon: RotateCcw,
      badge: 'Bi-Weekly',
      link: '/dashboard/intelligence/deadlocks',
    },
    {
      title: 'Geographic Hotspots & DBSCAN Spatial Clusters',
      description: 'Geospatial density analysis isolating physical infrastructure degradation corridors across urban wards.',
      category: 'GEOSPATIAL',
      icon: Flame,
      badge: 'Spatial',
      link: '/dashboard/map/hotspots',
    },
    {
      title: 'Officer Capacity & Workload Saturation Report',
      description: 'Division engineering load ratios highlighting overworked officers (>100%) and rebalancing targets.',
      category: 'HUMAN RESOURCES',
      icon: Users,
      badge: 'Operational',
      link: '/dashboard/officers',
    },
    {
      title: 'Forensic Visual Evidence & Chronicity Report',
      description: 'Printable forensic dossier featuring AI computer vision assessments and photographic progression across days.',
      category: 'FORENSIC',
      icon: Camera,
      badge: 'Print Ready',
      link: '/reports/visual-evidence/GRV-2026-0001',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-gold-400" />
            <span>EXECUTIVE & ADMINISTRATIVE INTELLIGENCE REPORTS</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standardized and on-demand statutory intelligence dossiers formatted for senior secretariats and municipal commissioners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsList.map((r, idx) => (
          <div
            key={idx}
            className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-5 shadow-card-dark transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold-400">
                  {r.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700">
                  {r.badge}
                </span>
              </div>

              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-dark-800 border border-gold-500/30 text-gold-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <r.icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">{r.title}</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pl-11 mb-4">
                {r.description}
              </p>
            </div>

            <div className="pt-3 border-t border-dark-800 flex items-center justify-between">
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition">
                <Download className="w-3.5 h-3.5 text-gold-400" />
                <span>Export CSV</span>
              </button>
              <a
                href={r.link}
                className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 uppercase"
              >
                <span>Generate Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
