'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { FailureScenarioSimulator } from '@/components/simulator/FailureScenarioSimulator';
import { BobExecutionModal } from '@/components/bob/BobExecutionModal';
import { Bot, ArrowLeft, ShieldAlert, CheckCircle2, FileCode, Play } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';

export default function IssueDetailPage() {
  const { currentCode, runBobFix, isFixed } = useDemo();
  const [isBobModalOpen, setIsBobModalOpen] = useState(false);

  const handleFixClick = async () => {
    setIsBobModalOpen(true);
    await runBobFix('PAY-142');
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-mono">
      {/* Top Back Link */}
      <Link href="/issues" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-mono">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Issues</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-bold">Issue #PAY-142</span>
            <span className="text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase">
              HIGH
            </span>
            <span className="text-xs px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold uppercase">
              Reliability
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-2">Unhandled Payment Provider Failure</h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Location: <strong className="text-slate-200">src/payments/paymentService.ts:112</strong>
          </p>
        </div>

        <button
          onClick={handleFixClick}
          className={clsx(
            'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition shadow-lg font-mono',
            isFixed
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
          )}
        >
          <Bot className="w-4 h-4 text-blue-200" />
          <span>{isFixed ? '[ Fix Applied - Re-run Analysis ]' : '[ Fix with IBM Bob ]'}</span>
        </button>
      </div>

      {/* Grid: Explanation & Affected Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Explanation Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base font-mono">Detailed Analysis & Explanation</h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            ShipSafe detected a failure path where the external payment gateway provider returns an HTTP 500 error or times out during execution.
          </p>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            The current implementation does not handle the response safely. Uncaught gateway rejections cause unhandled promise exceptions that bubble up to Express middleware, resulting in dropped connections and leaving the customer order in a stuck <strong className="text-amber-400">PENDING</strong> state.
          </p>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="text-slate-400 font-bold">RECOMMENDED REMEDIATION:</div>
            <ul className="list-disc list-inside text-slate-300 space-y-1 font-sans">
              <li>Wrap gateway call in try/catch exception handler</li>
              <li>Validate transaction response presence before property access</li>
              <li>Throw typed <code className="text-blue-400">PaymentProviderError</code></li>
              <li>Add unit tests covering HTTP 500 and socket timeout failure paths</li>
            </ul>
          </div>
        </div>

        {/* Affected File Code View */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base font-mono flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Affected Code Snippet</span>
            </h3>
            <span className="text-[11px] text-slate-400">Line 112</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto text-xs font-mono">
            <pre className="text-slate-300 leading-relaxed">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Failure Scenario Simulation Section */}
      <FailureScenarioSimulator />

      <BobExecutionModal isOpen={isBobModalOpen} onClose={() => setIsBobModalOpen(false)} />
    </div>
  );
}
