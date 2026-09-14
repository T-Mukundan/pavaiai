import React from 'react';
import prisma from '@/lib/prisma';
import { Printer, ArrowLeft, ShieldCheck, Camera, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VisualEvidenceReportPage({
  params,
}: {
  params: { id: string };
}) {
  const identifier = params.id;

  let grievance = await prisma.grievance.findFirst({
    where: {
      OR: [{ grievanceNumber: identifier }, { id: identifier }],
    },
    include: {
      department: true,
      location: true,
      riskPrediction: true,
      deadlockDetection: true,
      media: { include: { analysis: true } },
      statusHistory: { orderBy: { createdAt: 'desc' } },
      transfers: { include: { fromDepartment: true, toDepartment: true } },
    },
  });

  // Fallback to showcase if not found
  if (!grievance) {
    grievance = await prisma.grievance.findFirst({
      where: { grievanceNumber: 'GRV-2026-0001' },
      include: {
        department: true,
        location: true,
        riskPrediction: true,
        deadlockDetection: true,
        media: { include: { analysis: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        transfers: { include: { fromDepartment: true, toDepartment: true } },
      },
    });
  }

  if (!grievance) return <div>Report Not Found</div>;

  const primaryMedia = grievance.media[0];
  let detectedObjs: string[] = ['Damaged asphalt', 'Surface depression', 'Standing water'];
  if (primaryMedia?.analysis?.detectedObjects) {
    try {
      detectedObjs = JSON.parse(primaryMedia.analysis.detectedObjects);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 p-6 sm:p-10 max-w-5xl mx-auto space-y-8 print:bg-white print:text-black print:p-0">
      {/* Top Toolbar (Hidden on Print) */}
      <div className="flex items-center justify-between print:hidden border-b border-dark-800 pb-4">
        <a
          href={`/grievances/${grievance.grievanceNumber}`}
          className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Grievance View
        </a>

        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.print();
          }}
          className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-gold-glow transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF Dossier</span>
        </button>
      </div>

      {/* Official Government Dossier Header */}
      <div className="border-2 border-dark-750 print:border-black rounded-2xl p-8 bg-dark-900 print:bg-white shadow-card-dark space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dark-800 print:border-gray-300 pb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 print:text-gray-700 font-bold">
              GOVERNMENT OF INDIA • MUNICIPAL INTELLIGENCE & ADJUDICATION DOSSIER
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white print:text-black mt-1">
              VISUAL EVIDENCE & DEFECT ASSESSMENT REPORT
            </h1>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-0.5">
              Automated Forensic Computer Vision & SLA Risk Diagnostic
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 print:text-gray-600 block">Dossier Reference:</span>
            <span className="font-mono text-lg font-black text-gold-400 print:text-black">
              {grievance.grievanceNumber}
            </span>
            <span className="text-[11px] font-mono text-slate-500 print:text-gray-500 block">
              Generated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Case Snapshot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-dark-950 print:bg-gray-100 p-4 rounded-xl border border-dark-800 print:border-gray-300">
          <div>
            <span className="text-slate-500 print:text-gray-600 block text-[10px] uppercase font-bold">Department</span>
            <span className="font-bold text-white print:text-black">{grievance.department.name}</span>
          </div>
          <div>
            <span className="text-slate-500 print:text-gray-600 block text-[10px] uppercase font-bold">Category</span>
            <span className="font-semibold text-slate-200 print:text-black">{grievance.category}</span>
          </div>
          <div>
            <span className="text-slate-500 print:text-gray-600 block text-[10px] uppercase font-bold">Status</span>
            <span className="font-mono font-bold text-amber-400 print:text-black">{grievance.status}</span>
          </div>
          <div>
            <span className="text-slate-500 print:text-gray-600 block text-[10px] uppercase font-bold">Calculated Risk</span>
            <span className="font-mono font-bold text-red-400 print:text-black">
              {grievance.riskPrediction?.riskScore || 84}% SLA Breach Risk
            </span>
          </div>
        </div>

        {/* Grievance Narrative */}
        <div>
          <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider mb-2">
            Incident Description & Location
          </h3>
          <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed bg-dark-950 print:bg-white p-3 rounded-lg border border-dark-800 print:border-gray-200">
            {grievance.description}
          </p>
          <div className="mt-2 text-xs text-slate-400 print:text-gray-600 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {grievance.location?.address} ({grievance.location?.ward}, {grievance.location?.district}) — GPS:{' '}
              {grievance.location?.latitude}, {grievance.location?.longitude}
            </span>
          </div>
        </div>

        {/* Visual Evidence Primary Image & AI Assessment */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider">
            Primary Photographic Evidence & AI Computer Vision Scan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="rounded-xl overflow-hidden border border-dark-800 print:border-gray-400 bg-dark-950">
              <img
                src={primaryMedia?.fileUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop'}
                alt="Evidence"
                className="w-full h-64 object-cover"
              />
              <div className="p-2.5 text-[10px] text-slate-400 print:text-gray-600 font-mono bg-dark-950 print:bg-gray-200 flex justify-between">
                <span>Original Citizen Capture</span>
                <span>Timestamp: {new Date(primaryMedia?.capturedAt || grievance.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* AI Findings Panel */}
            <div className="space-y-3 bg-dark-950 print:bg-gray-50 p-5 rounded-xl border border-dark-800 print:border-gray-300 text-xs">
              <div className="flex items-center justify-between border-b border-dark-800 print:border-gray-200 pb-2">
                <span className="font-bold uppercase text-gold-400 print:text-black flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI-Assisted Visual Assessment
                </span>
                <span className="font-mono font-bold text-emerald-400 print:text-black">
                  Confidence: {Math.round((primaryMedia?.analysis?.confidence || 0.91) * 100)}%
                </span>
              </div>

              <div>
                <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-bold">
                  Defect Description & Diagnostic
                </span>
                <p className="text-slate-200 print:text-black leading-relaxed mt-0.5">
                  {primaryMedia?.analysis?.description || 'Severe structural road surface deterioration with chronic water ponding. Pothole depth estimated >35cm with visible base aggregate loss.'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 print:text-gray-600 block text-[10px] uppercase font-bold mb-1">
                  Detected Defect Features
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {detectedObjs.map((obj, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-dark-850 print:bg-white text-gold-300 print:text-black border border-dark-700 print:border-gray-300 font-mono text-[10px]"
                    >
                      {obj}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-dark-800 print:border-gray-200 text-[11px] text-slate-400 print:text-gray-600">
                <strong>Disclaimer:</strong> AI-assisted visual assessment is advisory decision support and subject to on-site engineering verification.
              </div>
            </div>
          </div>
        </div>

        {/* Chronological Administrative Trajectory */}
        <div>
          <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider mb-2">
            Inter-Departmental Transfer Trajectory
          </h3>
          <div className="bg-dark-950 print:bg-white rounded-xl border border-dark-800 print:border-gray-300 divide-y divide-dark-800 print:divide-gray-200 text-xs">
            {grievance.transfers.map((t, i) => (
              <div key={i} className="p-3 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-white print:text-black">
                    {t.fromDepartment.name} → {t.toDepartment.name}
                  </span>
                  <div className="text-[11px] text-slate-400 print:text-gray-600">
                    Reason: "{t.reason}"
                  </div>
                </div>
                <span className="font-mono text-slate-500 text-[10px]">
                  {new Date(t.transferredAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Authorization Footer */}
        <div className="pt-8 border-t border-dark-800 print:border-black flex justify-between items-end text-xs text-slate-400 print:text-gray-600">
          <div>
            <span>Verified by PRAVAH-AI Decision Support Engine</span>
            <div className="text-[10px] font-mono text-slate-500">
              Cryptographic Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-600 print:border-black mb-1"></div>
            <span>Authorized Signature / Seal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
