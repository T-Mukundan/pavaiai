'use client';

import React from 'react';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  RotateCcw, 
  Network,
  ArrowUpRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
  accentColor: string;
  href: string;
}

function MetricCard({
  label,
  value,
  subtext,
  trend,
  trendUp,
  icon: Icon,
  accentColor,
  href,
}: MetricCardProps) {
  return (
    <a
      href={href}
      className="group relative bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-4 transition-all duration-250 flex flex-col justify-between overflow-hidden shadow-card-dark"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className={`p-2 rounded-lg ${accentColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="my-1">
        <div className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white group-hover:text-gold-400 transition-colors">
          {value}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{subtext}</div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-dark-800 flex items-center justify-between text-[11px]">
        <span
          className={`flex items-center gap-1 font-semibold ${
            trendUp ? 'text-amber-400' : 'text-emerald-400'
          }`}
        >
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </span>
        <span className="text-slate-500 group-hover:text-gold-400 transition-colors flex items-center gap-0.5 text-[10px] font-bold">
          VIEW <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}

export default function KPICards() {
  const kpis: MetricCardProps[] = [
    {
      label: 'TOTAL GRIEVANCES',
      value: '1,284',
      subtext: 'Historical & active intake',
      trend: '+14% this month',
      trendUp: true,
      icon: FileText,
      accentColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
      href: '/dashboard/grievances',
    },
    {
      label: 'ACTIVE BACKLOG',
      value: '347',
      subtext: 'Pending operational action',
      trend: '-6% reduction via AI rerouting',
      trendUp: false,
      icon: Clock,
      accentColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      href: '/dashboard/grievances?status=IN_PROGRESS',
    },
    {
      label: 'HIGH SLA RISK',
      value: '86',
      subtext: 'Predicted >75% breach risk',
      trend: 'TreeSHAP high-confidence flag',
      trendUp: true,
      icon: AlertTriangle,
      accentColor: 'bg-red-500/15 text-red-400 border border-red-500/30',
      href: '/dashboard/grievances/high-risk',
    },
    {
      label: 'SLA BREACHES',
      value: '42',
      subtext: 'Past standard deadline',
      trend: 'Escalation triggered',
      trendUp: true,
      icon: ShieldAlert,
      accentColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      href: '/dashboard/grievances/sla',
    },
    {
      label: 'DEADLOCKED CASES',
      value: '17',
      subtext: 'Tarjan SCC circular routing',
      trend: 'Bureaucratic ping-pong',
      trendUp: true,
      icon: RotateCcw,
      accentColor: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
      href: '/dashboard/grievances/deadlocked',
    },
    {
      label: 'RECURRING CLUSTERS',
      value: '31',
      subtext: 'MiniLM semantic loopbacks',
      trend: 'Cross-citizen duplicate signal',
      trendUp: true,
      icon: Network,
      accentColor: 'bg-gold-500/15 text-gold-400 border border-gold-500/30',
      href: '/dashboard/grievances/recurring',
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {kpis.map((kpi, idx) => (
        <MetricCard key={idx} {...kpi} />
      ))}
    </section>
  );
}
