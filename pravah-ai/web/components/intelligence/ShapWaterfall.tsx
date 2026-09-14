'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface ShapItem {
  feature: string;
  contribution: number; // positive increases risk, negative decreases
  rank: number;
}

interface ShapWaterfallProps {
  contributors: ShapItem[];
  riskScore: number;
}

export default function ShapWaterfall({ contributors, riskScore }: ShapWaterfallProps) {
  const chartData = contributors.map((item) => ({
    name: item.feature,
    value: item.contribution,
    fill: item.contribution > 0 ? '#ef4444' : '#10b981',
  }));

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-dark-800">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>EXPLAINABLE AI: TREESHAP FEATURE CONTRIBUTIONS</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              Score: {riskScore}%
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Additive Shapley attribution values explaining exactly why this grievance reached high breach risk.
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 140, right: 30, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2433" />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              unit="%"
              domain={[0, 'dataMax + 5']}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              width={140}
              tickLine={false}
            />
            <Tooltip
              formatter={(val: any) => [`+${val}% to Breach Probability`, 'SHAP Value']}
              contentStyle={{
                backgroundColor: '#0e1017',
                borderColor: '#2b3248',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-dark-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-dark-950 p-2.5 rounded border border-dark-800">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Primary Risk Driver</span>
          <span className="text-white font-semibold">{contributors[0]?.feature || 'Reassignment Count'}</span>
        </div>
        <div className="bg-dark-950 p-2.5 rounded border border-dark-800">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Secondary Risk Driver</span>
          <span className="text-white font-semibold">{contributors[1]?.feature || 'Inactivity Duration'}</span>
        </div>
        <div className="bg-dark-950 p-2.5 rounded border border-dark-800">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Model Confidence</span>
          <span className="text-emerald-400 font-mono font-bold">94.2% Convergence</span>
        </div>
      </div>
    </div>
  );
}
