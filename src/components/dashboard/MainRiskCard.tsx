'use client';

import React from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { ShieldAlert, ArrowRight, GitCommit, Clock, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export function MainRiskCard() {
  const { analysis, isFixed } = useDemo();

  const score = analysis.overallRiskScore;
  const isHigh = score >= 50;

  // SVG Circular Gauge calculation
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const categories = [
    { label: 'Security', score: analysis.categoryScores.security, color: 'bg-blue-500' },
    { label: 'Reliability', score: analysis.categoryScores.reliability, color: 'bg-amber-500' },
    { label: 'Testing', score: analysis.categoryScores.testing, color: 'bg-purple-500' },
    { label: 'Dependencies', score: analysis.categoryScores.dependencies, color: 'bg-indigo-500' },
    { label: 'Change Risk', score: analysis.categoryScores.changeRisk, color: 'bg-slate-500' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Info Block */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              CURRENT RELEASE #184
            </span>
            <span className={clsx(
              'text-xs font-mono font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5',
              isHigh ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            )}>
              {isHigh ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              {isHigh ? 'RELEASE BLOCKED' : '✓ RELEASE READY'}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
              payment-service
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                feature/payment-v2
              </span>
              <span className="flex items-center gap-1">
                <GitCommit className="w-3.5 h-3.5 text-slate-500" />
                8f3a921
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Analyzed {analysis.analyzedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Center Circular Risk Indicator */}
        <div className="flex items-center gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className={clsx('transition-all duration-700 ease-out', isHigh ? 'stroke-red-500' : 'stroke-emerald-500')}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={clsx('text-2xl font-extrabold font-mono', isHigh ? 'text-red-400' : 'text-emerald-400')}>
                {score}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {isHigh ? 'HIGH RISK' : 'LOW RISK'}
              </span>
            </div>
          </div>

          {/* Sub-scores Bars */}
          <div className="space-y-2 w-48">
            {categories.map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{cat.label}</span>
                  <span className="font-bold text-slate-200">{cat.score}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={clsx('h-full transition-all duration-500', cat.color)}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {analysis.summary}
        </p>
        <Link
          href="/releases/184"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm font-mono"
        >
          <span>View Full Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
