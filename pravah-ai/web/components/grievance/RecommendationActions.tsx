'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RecommendationActionsProps {
  grievanceId: string;
  grievanceNumber: string;
  initialStatus?: string;
  actionTakenBy?: string | null;
  returnUrl?: string;
  compact?: boolean;
}

export default function RecommendationActions({
  grievanceId,
  grievanceNumber,
  initialStatus = 'PENDING',
  actionTakenBy,
  returnUrl,
  compact = false,
}: RecommendationActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(initialStatus);
  const [loading, setLoading] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    setLoading(action);
    setFeedback(null);

    try {
      const endpoint = action === 'APPROVE' ? '/api/recommendations/approve' : '/api/recommendations/reject';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grievanceId, returnUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }

      setStatus(action === 'APPROVE' ? 'APPROVED' : 'REJECTED');
      setFeedback(
        action === 'APPROVE'
          ? '✓ Action approved! Case escalated to Dr. Sunita Rao, IAS for expedited joint execution.'
          : 'Recommendation marked as rejected.'
      );
      router.refresh();
    } catch (err: any) {
      console.error('Error executing recommendation action:', err);
      setFeedback(err.message || 'Action failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (status === 'APPROVED') {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Approved & Escalated ({actionTakenBy || 'Nodal Officer'})</span>
        </div>
        {feedback && (
          <span className="text-[11px] text-emerald-400 font-mono text-right">{feedback}</span>
        )}
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className="inline-flex items-center gap-1.5 bg-dark-800 border border-dark-700 text-slate-400 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold">
        <XCircle className="w-4 h-4 text-slate-400" />
        <span>Rejected</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => handleAction('APPROVE')}
          className={`${
            compact ? 'px-3 py-1.5' : 'px-4 py-2'
          } bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white rounded-lg text-xs font-bold tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
          title="Approve recommendation and escalate to Nodal Officer"
        >
          {loading === 'APPROVE' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          <span>{loading === 'APPROVE' ? 'Approving...' : 'Approve Action'}</span>
        </button>

        <button
          type="button"
          disabled={loading !== null}
          onClick={() => handleAction('REJECT')}
          className={`${
            compact ? 'px-3 py-1.5' : 'px-3.5 py-2'
          } bg-dark-800 hover:bg-dark-750 active:scale-95 disabled:opacity-50 text-slate-300 rounded-lg text-xs font-semibold border border-dark-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer`}
          title="Reject this recommendation"
        >
          {loading === 'REJECT' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{loading === 'REJECT' ? 'Rejecting...' : 'Reject'}</span>
        </button>
      </div>

      {feedback && (
        <span className="text-[11px] text-red-400 font-mono">{feedback}</span>
      )}
    </div>
  );
}
