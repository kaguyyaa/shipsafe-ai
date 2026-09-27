'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { AlertCircle, ShieldCheck, CheckCircle2, FileCode, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export function KPICards() {
  const { analysis, isFixed } = useDemo();

  const riskScore = analysis.overallRiskScore;
  const isHighRisk = riskScore >= 50;

  const activeIssues = analysis.issues.filter(i => i.status === 'open');
  const criticalCount = activeIssues.filter(i => i.severity === 'critical').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* 1. Release Risk */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Release Risk</span>
          <AlertCircle className={clsx('w-4 h-4', isHighRisk ? 'text-red-400' : 'text-emerald-400')} />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className={clsx('text-3xl font-extrabold font-mono', isHighRisk ? 'text-red-400' : 'text-emerald-400')}>
              {riskScore}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={clsx(
                'text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase',
                isHighRisk
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              )}
            >
              {analysis.riskLevel} RISK
            </span>
          </div>
        </div>
      </div>

      {/* 2. Open Issues */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Issues</span>
          <Activity className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold text-white font-mono">{activeIssues.length}</div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            <span className={clsx('font-bold', criticalCount > 0 ? 'text-red-400' : 'text-slate-400')}>
              {criticalCount} Critical
            </span>
          </div>
        </div>
      </div>

      {/* 3. Security Score */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security</span>
          <ShieldCheck className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white font-mono">{analysis.categoryScores.security}</span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {isFixed ? '🛡 AST & Vulns Passed' : '⚠️ SQLi & Auth Issues'}
          </div>
        </div>
      </div>

      {/* 4. Test Coverage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Test Coverage</span>
          <FileCode className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold text-white font-mono">{analysis.testCoveragePercent}%</div>
          <div className="mt-1 text-xs text-slate-400">
            {isFixed ? '✓ +6 Tests Generated' : '⚠️ 3 Scenarios Missing'}
          </div>
        </div>
      </div>

      {/* 5. Releases Analyzed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Releases Analyzed</span>
          <CheckCircle2 className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-3">
          <div className="text-3xl font-extrabold text-white font-mono">184</div>
          <div className="mt-1 text-xs text-slate-400">Across 3 repositories</div>
        </div>
      </div>
    </div>
  );
}
