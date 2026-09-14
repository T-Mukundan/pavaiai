'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const BACKLOG_TREND = [
  { day: 'Day 1', total: 410, resolved: 28, breached: 12 },
  { day: 'Day 5', total: 432, resolved: 45, breached: 18 },
  { day: 'Day 10', total: 390, resolved: 58, breached: 24 },
  { day: 'Day 15', total: 375, resolved: 64, breached: 32 },
  { day: 'Day 20', total: 360, resolved: 72, breached: 38 },
  { day: 'Day 25', total: 347, resolved: 85, breached: 42 },
];

const DEPT_PERFORMANCE = [
  { name: 'Roads & Hwy', active: 84, breached: 16, resolved: 140 },
  { name: 'Drainage', active: 62, breached: 11, resolved: 95 },
  { name: 'Water Supply', active: 58, breached: 8, resolved: 112 },
  { name: 'Electricity', active: 45, breached: 4, resolved: 130 },
  { name: 'Solid Waste', active: 40, breached: 2, resolved: 165 },
  { name: 'Revenue', active: 36, breached: 9, resolved: 48 },
  { name: 'Traffic', active: 22, breached: 1, resolved: 82 },
];

const RISK_DISTRIBUTION = [
  { name: 'Low Risk (<45%)', value: 580, color: '#10b981' },
  { name: 'Moderate (45-65%)', value: 390, color: '#f5c518' },
  { name: 'High Risk (65-80%)', value: 228, color: '#f97316' },
  { name: 'Critical (>80%)', value: 86, color: '#ef4444' },
];

const WORKLOAD_RATIO = [
  { officer: 'V. Malhotra (Roads)', load: 126, capacity: 100 },
  { officer: 'R. Nair (Drainage)', load: 115, capacity: 100 },
  { officer: 'A. Deshmukh (Water)', load: 94, capacity: 100 },
  { officer: 'D. Verma (Power)', load: 82, capacity: 100 },
  { officer: 'K. Joshi (Waste)', load: 70, capacity: 100 },
  { officer: 'A. Sen (Civic)', load: 58, capacity: 100 },
];

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
      {/* 1. Backlog & SLA Breach Trend (7 cols) */}
      <div className="lg:col-span-7 bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              30-DAY BACKLOG VS SLA BREACH TRAJECTORY
            </h3>
            <p className="text-xs text-slate-400">
              Active unresolved complaints and SLA breach accumulation rate.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            AI Reroute Effect: -15.3%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={BACKLOG_TREND}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5c518" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f5c518" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorBreach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2433" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e1017',
                  borderColor: '#2b3248',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="total"
                name="Active Backlog"
                stroke="#f5c518"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="breached"
                name="SLA Breached"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBreach)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Predictive Risk Distribution (5 cols) */}
      <div className="lg:col-span-5 bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              PREDICTIVE SLA RISK DISTRIBUTION
            </h3>
            <p className="text-xs text-slate-400">
              TreeSHAP / LightGBM 0-100 severity risk scoring.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
            86 High Risk
          </span>
        </div>

        <div className="h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={RISK_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {RISK_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0e1017" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e1017',
                  borderColor: '#2b3248',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-800 text-[11px]">
          {RISK_DISTRIBUTION.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 truncate">{item.name}</span>
              <span className="ml-auto font-mono font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Department Caseload & Breaches (7 cols) */}
      <div className="lg:col-span-7 bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              DEPARTMENT CASELOAD & RESOLUTION VELOCITY
            </h3>
            <p className="text-xs text-slate-400">
              Active intake vs breaches across critical municipal departments.
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEPT_PERFORMANCE} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2433" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e1017',
                  borderColor: '#2b3248',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="active" name="Active Backlog" fill="#f5c518" radius={[4, 4, 0, 0]} />
              <Bar dataKey="breached" name="Breached Cases" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Officer Workload Ratio (5 cols) */}
      <div className="lg:col-span-5 bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              OFFICER WORKLOAD IMBALANCE (CAPACITY %)
            </h3>
            <p className="text-xs text-slate-400">
              Assigned cases compared to standard workload capacity.
            </p>
          </div>
          <a
            href="/dashboard/officers"
            className="text-[10px] font-bold text-gold-400 hover:underline uppercase"
          >
            Rebalance
          </a>
        </div>

        <div className="space-y-3 my-auto">
          {WORKLOAD_RATIO.map((off, idx) => {
            const isOverloaded = off.load > 100;
            const barWidth = Math.min(100, off.load);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{off.officer}</span>
                  <span
                    className={`font-mono font-bold ${
                      isOverloaded ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {off.load}% {isOverloaded && '(Overloaded)'}
                  </span>
                </div>
                <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isOverloaded ? 'bg-red-500 shadow-red-glow' : 'bg-gold-500'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-dark-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Standard capacity threshold: 100% (20 cases)</span>
          <span className="text-gold-400 font-semibold">2 officers require rebalancing</span>
        </div>
      </div>
    </div>
  );
}
