'use client';

import React from 'react';
import { ArrowUpRight, AlertTriangle, Clock, ShieldAlert, Sparkles } from 'lucide-react';

export default function SpotlightCard() {
  return (
    <section className="mb-8">
      {/* Header matching "EDITOR'S PICK" with "SEE MORE" link in gold */}
      <div className="flex items-center justify-between mb-4 border-b border-dark-800 pb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white uppercase">
            INTELLIGENCE SPOTLIGHT
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
            <Sparkles className="w-3 h-3" />
            CRITICAL VECTOR CASES
          </span>
        </div>
        <a
          href="/dashboard/grievances/high-risk"
          className="flex items-center gap-1 text-xs font-bold tracking-wider text-gold-400 hover:text-gold-300 uppercase transition-colors"
        >
          SEE ALL HIGH RISK <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* 3-Column Editorial Grid mirroring reference screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: 2 Stacked Cards (3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5">
          {/* Left Top Card */}
          <a
            href="/grievances/GRV-2026-0004"
            className="group flex flex-col bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl overflow-hidden p-3 transition-all duration-300"
          >
            <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 bg-dark-800">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop"
                alt="Electrical spark"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600/90 text-white text-[10px] font-bold font-mono shadow-sm">
                92% RISK
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] flex items-center justify-center border border-gold-500/40">
                D
              </div>
              <span className="text-xs text-slate-300 font-medium">Deepak Verma</span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-[11px] text-slate-400">2 days stalled</span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2 leading-snug mb-2">
              Distribution Transformer Arc Sparking at Shivaji Circle
            </h3>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-wider">
              <span className="text-gold-400 uppercase">POWER INFRASTRUCTURE</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">SLA: 24h</span>
            </div>
          </a>

          {/* Left Bottom Card */}
          <a
            href="/grievances/GRV-2026-0002"
            className="group flex flex-col bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl overflow-hidden p-3 transition-all duration-300"
          >
            <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 bg-dark-800">
              <img
                src="https://images.unsplash.com/photo-1584463699039-383e74d15663?q=80&w=600&auto=format&fit=crop"
                alt="Collapsed drain"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600/90 text-white text-[10px] font-bold font-mono shadow-sm">
                76% RISK
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] flex items-center justify-center border border-gold-500/40">
                R
              </div>
              <span className="text-xs text-slate-300 font-medium">Rajesh Nair</span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-[11px] text-slate-400">12 days stalled</span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2 leading-snug mb-2">
              Stormwater Drain Grate Collapse with Exposed Rebar
            </h3>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-wider">
              <span className="text-gold-400 uppercase">DRAINAGE & STORMWATER</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">SLA: Breached</span>
            </div>
          </a>
        </div>

        {/* CENTER HERO CARD: Primary Showcase Complaint GRV-2026-0001 (6 cols) */}
        <div className="lg:col-span-6">
          <a
            href="/grievances/GRV-2026-0001"
            className="group relative flex flex-col justify-end h-full min-h-[440px] bg-dark-900 border border-dark-750 hover:border-gold-500/60 rounded-xl overflow-hidden p-6 shadow-card-dark transition-all duration-300"
          >
            {/* Background High-res image with dark gradient vignette */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop"
                alt="Crater & water ponding"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent"></div>
            </div>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded bg-purple-600/90 text-white text-xs font-black font-mono tracking-wider flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                DEADLOCK DETECTED (3 TRANSFERS)
              </span>
              <span className="px-3 py-1 rounded bg-red-600 text-white text-xs font-black font-mono shadow-red-glow">
                84% SLA RISK
              </span>
            </div>

            {/* Content Overlaid at Bottom */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gold-500 text-black font-extrabold text-xs flex items-center justify-center shadow-gold-glow">
                  P
                </div>
                <span className="text-xs text-white font-semibold">Priya Sharma (Citizen)</span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs text-slate-300 font-medium">18 days stalled in routing cycle</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white group-hover:text-gold-400 transition-colors leading-tight">
                Severe Road Crater & Water Accumulation at Central Bus Terminal
              </h1>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                Primary arterial asphalt collapsed into deep craters. Trapped in bureaucratic cycle: Roads Dept → Municipal Corp → Revenue → Roads Dept. AI recommends immediate Nodal intervention.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
                  <span className="text-gold-400 uppercase">ROAD INFRASTRUCTURE</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-mono">GRV-2026-0001</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gold-400 group-hover:translate-x-1 transition-transform">
                  INVESTIGATE INTELLIGENCE <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </a>
        </div>

        {/* RIGHT COLUMN: 2 Stacked Cards (3 cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5">
          {/* Right Top Card */}
          <a
            href="/grievances/GRV-2026-0007"
            className="group flex flex-col bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl overflow-hidden p-3 transition-all duration-300"
          >
            <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 bg-dark-800">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop"
                alt="Land revenue"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600/90 text-white text-[10px] font-bold font-mono shadow-sm">
                88% RISK
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] flex items-center justify-center border border-gold-500/40">
                S
              </div>
              <span className="text-xs text-slate-300 font-medium">Sneha Kulkarni</span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-[11px] text-slate-400">40 days stalled</span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2 leading-snug mb-2">
              Delayed Land Mutation & Property Title Certificate (Ward 10)
            </h3>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-wider">
              <span className="text-gold-400 uppercase">LAND & REVENUE</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Deadlock: 2 Nodes</span>
            </div>
          </a>

          {/* Right Bottom Card */}
          <a
            href="/grievances/GRV-2026-0005"
            className="group flex flex-col bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl overflow-hidden p-3 transition-all duration-300"
          >
            <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 bg-dark-800">
              <img
                src="https://images.unsplash.com/photo-1584463699039-383e74d15663?q=80&w=600&auto=format&fit=crop"
                alt="Water leak"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-500/90 text-black text-[10px] font-black font-mono shadow-sm">
                79% RISK
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px] flex items-center justify-center border border-gold-500/40">
                A
              </div>
              <span className="text-xs text-slate-300 font-medium">Ananya Deshmukh</span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-[11px] text-slate-400">8 days stalled</span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-2 leading-snug mb-2">
              Contaminated Tap Water with Chemical Odor — Indiranagar
            </h3>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-bold tracking-wider">
              <span className="text-gold-400 uppercase">WATER SUPPLY</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Cluster: 38 cases</span>
            </div>
          </a>
        </div>

      </div>
    </section>
  );
}
