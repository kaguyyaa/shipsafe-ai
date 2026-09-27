'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { Download, Share2, FileText, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export default function ReportsPage() {
  const { analysis, isFixed } = useDemo();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isBlocked = analysis.status === 'blocked';

  const handleDownload = () => {
    setToastMsg('Downloading Executive Release Safety Report PDF...');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleShare = () => {
    setToastMsg('Release report link copied to clipboard!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Release Reports</h1>
          <p className="text-sm text-slate-400 font-sans mt-1">Export compliance, security, and release safety audit documents.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Report</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="bg-blue-600/20 border border-blue-500/40 text-blue-300 px-4 py-2.5 rounded-lg text-xs font-mono">
          ✓ {toastMsg}
        </div>
      )}

      {/* Main Executive Report Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Release Audit Summary — Release #184</h2>
              <p className="text-xs text-slate-400">Target Repository: payment-service (feature/payment-v2)</p>
            </div>
          </div>

          <span
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-bold border uppercase',
              isBlocked ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            )}
          >
            {isBlocked ? '✕ RELEASE BLOCKED' : '✓ RELEASE READY'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-500">Final Risk Score</div>
            <div className={clsx('text-2xl font-extrabold mt-1', isBlocked ? 'text-red-400' : 'text-emerald-400')}>
              {analysis.overallRiskScore} / 100
            </div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-500">Issues Detected</div>
            <div className="text-2xl font-extrabold text-white mt-1">{isFixed ? '12' : '12'}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-500">Issues Resolved</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{isFixed ? '10' : '0'}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-slate-500">Tests Added</div>
            <div className="text-2xl font-extrabold text-purple-400 mt-1">{isFixed ? '17' : '11'}</div>
          </div>
        </div>

        <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="font-bold text-slate-200 font-mono text-sm">RELEASE AUDIT DECISION STATEMENT</div>
          <p>
            {isBlocked
              ? 'Release #184 currently contains high-risk unhandled payment provider exceptions and critical security vulnerabilities. Deployment to production is strictly blocked according to enterprise release safety policy.'
              : 'ShipSafe AI Release Engineer verified that IBM Bob successfully remediated the unhandled payment provider exception and generated 6 passing regression tests. Risk index dropped from 72 to 18. Release #184 is approved for deployment.'}
          </p>
        </div>
      </div>
    </div>
  );
}
