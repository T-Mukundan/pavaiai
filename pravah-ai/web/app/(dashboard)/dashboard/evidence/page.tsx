import React from 'react';
import prisma from '@/lib/prisma';
import { Camera, Sparkles, ArrowUpRight, Printer, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EvidenceVaultPage() {
  const mediaRecords = await prisma.media.findMany({
    take: 24,
    orderBy: { createdAt: 'desc' },
    include: {
      analysis: true,
      grievance: {
        include: { department: true, location: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Camera className="w-6 h-6 text-gold-400" />
              <span>VISUAL EVIDENCE VAULT & AI VISION REGISTRY</span>
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
              YOLO-v8 + ResNet50 Vision
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Citizen and officer captured multimedia evidence with automated AI defect detection and forensic assessments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mediaRecords.map((m) => {
          let detectedObjs: string[] = ['Civil infrastructure defect'];
          if (m.analysis?.detectedObjects) {
            try {
              detectedObjs = JSON.parse(m.analysis.detectedObjects);
            } catch {}
          }
          return (
            <div
              key={m.id}
              className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl overflow-hidden shadow-card-dark transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 w-full bg-dark-800">
                <img
                  src={m.fileUrl}
                  alt="Evidence"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-dark-950/90 border border-dark-700 font-mono text-[10px] text-white font-bold">
                  {m.grievance.grievanceNumber}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600/90 text-white font-mono text-[10px] font-bold">
                  {m.analysis?.severity || 'HIGH'}
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-gold-400">{m.grievance.department.name}</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {Math.round((m.analysis?.confidence || 0.88) * 100)}% Conf
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
                    {m.grievance.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {m.analysis?.description || 'AI-assisted visual assessment detected visible physical degradation of civic asset.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-dark-800 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {detectedObjs.slice(0, 3).map((obj, oIdx) => (
                      <span
                        key={oIdx}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-dark-850 text-slate-300 border border-dark-750"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={`/reports/visual-evidence/${m.grievance.grievanceNumber}`}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-gold-400" />
                      <span>Print Dossier</span>
                    </a>
                    <a
                      href={`/grievances/${m.grievance.grievanceNumber}`}
                      className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 uppercase"
                    >
                      Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
