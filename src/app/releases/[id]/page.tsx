'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { BobExecutionModal } from '@/components/bob/BobExecutionModal';
import { BeforeAfterMatrix } from '@/components/analysis/BeforeAfterMatrix';
import { ShieldAlert, CheckCircle2, Bot, AlertTriangle, ArrowRight, ShieldCheck, FileCode, Layers } from 'lucide-react';
import { clsx } from 'clsx';

export default function ReleaseAnalysisPage() {
  const { analysis, isFixed, runBobFix } = useDemo();
  const [isBobModalOpen, setIsBobModalOpen] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const isBlocked = analysis.status === 'blocked';
  const riskScore = analysis.overallRiskScore;

  const activeIssues = analysis.issues.filter((i) => i.status === 'open');
  const filteredIssues = filterSeverity === 'all'
    ? activeIssues
    : activeIssues.filter(i => i.severity === filterSeverity);

  const handleFixClick = async (issueId: string) => {
    setIsBobModalOpen(true);
    await runBobFix(issueId);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-mono">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">Release #184</h1>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
              payment-service
            </span>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-blue-400">
              feature/payment-v2
            </span>
            <span className="text-xs text-slate-400 font-mono">Commit: 8f3a921</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Analyzed {analysis.analyzedAt}</p>
        </div>

        {/* Large Status Badge */}
        <div className="flex items-center gap-4">
          <div
            className={clsx(
              'px-4 py-2 rounded-xl font-extrabold text-sm border flex items-center gap-2 shadow-lg',
              isBlocked
                ? 'bg-red-500/10 border-red-500/40 text-red-400 shadow-red-500/10'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
            )}
          >
            {isBlocked ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span>{isBlocked ? '✕ RELEASE BLOCKED' : '✓ RELEASE READY'}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-center min-w-[100px]">
            <div className="text-[10px] text-slate-400 font-mono uppercase">RISK SCORE</div>
            <div className={clsx('text-xl font-extrabold font-mono', isBlocked ? 'text-red-400' : 'text-emerald-400')}>
              {riskScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Description Banner */}
      <div className={clsx('p-4 rounded-xl border text-xs font-sans leading-relaxed', isBlocked ? 'bg-red-500/5 border-red-500/20 text-red-300' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300')}>
        {isBlocked
          ? 'ShipSafe detected release-blocking security, reliability, and testing issues that should be resolved before deployment.'
          : 'ShipSafe verified that all release-blocking issues have been resolved by IBM Bob. Regression tests passed.'}
      </div>

      {/* Before / After Matrix when fixed */}
      <BeforeAfterMatrix />

      {/* 5 Category Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Security */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Security</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analysis.categoryScores.security} / 100</div>
          <div className="text-[11px] text-slate-400 font-sans">
            {isFixed ? '0 Critical / 0 High' : '2 issues (1 Critical, 1 Medium)'}
          </div>
        </div>

        {/* Reliability */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Reliability</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analysis.categoryScores.reliability} / 100</div>
          <div className="text-[11px] text-slate-400 font-sans">
            {isFixed ? '0 High / 1 Medium' : '3 issues (2 High, 1 Medium)'}
          </div>
        </div>

        {/* Testing */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Testing</span>
            <FileCode className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analysis.categoryScores.testing} / 100</div>
          <div className="text-[11px] text-slate-400 font-sans">
            Coverage: {analysis.testCoveragePercent}%
          </div>
        </div>

        {/* Dependencies */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dependencies</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analysis.categoryScores.dependencies} / 100</div>
          <div className="text-[11px] text-slate-400 font-sans">
            {isFixed ? 'Audit passed' : '1 vulnerability'}
          </div>
        </div>

        {/* Change Risk */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Change Risk</span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{analysis.categoryScores.changeRisk} / 100</div>
          <div className="text-[11px] text-slate-400 font-sans">18 files (+427/-103)</div>
        </div>
      </div>

      {/* Issues Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Detected Issues ({activeIssues.length})</span>
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Filter Severity:</span>
            {['all', 'critical', 'high', 'medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={clsx(
                  'px-2.5 py-1 rounded-md uppercase font-bold transition',
                  filterSeverity === sev
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                )}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 text-xs">
              ✓ No open issues match the selected filter.
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={clsx(
                        'text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider border',
                        issue.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : issue.severity === 'high'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      )}
                    >
                      {issue.severity}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                      {issue.type}
                    </span>
                    <h3 className="font-bold text-white text-base">{issue.title}</h3>
                  </div>

                  <div className="text-xs text-slate-400">
                    {issue.file}:{issue.line}
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {issue.description}
                </p>

                {/* Grounded Fact Snippet vs AI Explanation Distinction */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">DETECTED AST FACT</div>
                    <code className="text-slate-300 block truncate">{issue.factSnippet}</code>
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-400 font-bold uppercase mb-1">AI EXPLANATION</div>
                    <p className="text-slate-400 font-sans text-[11px] leading-tight">{issue.explanation}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/issues/${issue.id.toLowerCase()}`}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                  >
                    <span>[View Issue Details]</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {issue.isFixableByBob && (
                    <button
                      onClick={() => handleFixClick(issue.id)}
                      className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-600/20"
                    >
                      <Bot className="w-4 h-4 text-blue-200" />
                      <span>[ Fix with IBM Bob ]</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* IBM Bob Execution Modal */}
      <BobExecutionModal isOpen={isBobModalOpen} onClose={() => setIsBobModalOpen(false)} />
    </div>
  );
}
