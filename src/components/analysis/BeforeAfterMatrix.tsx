'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { ArrowDownRight, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

export function BeforeAfterMatrix() {
  const { isFixed } = useDemo();

  if (!isFixed) return null;

  const rows = [
    { label: 'Risk Score', before: '72', after: '18', improved: true, isRisk: true },
    { label: 'Security Score', before: '82', after: '94', improved: true },
    { label: 'Reliability Score', before: '61', after: '91', improved: true },
    { label: 'Testing Score', before: '48', after: '86', improved: true },
    { label: 'Dependencies Score', before: '79', after: '95', improved: true },
    { label: 'Critical Issues', before: '2', after: '0', improved: true, isRisk: true },
    { label: 'High Severity Issues', before: '3', after: '0', improved: true, isRisk: true },
    { label: 'Medium Severity Issues', before: '7', after: '2', improved: true, isRisk: true },
    { label: 'Regression Tests Added', before: '0', after: '+6', improved: true },
  ];

  return (
    <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl shadow-emerald-500/5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">RELEASE SAFETY IMPROVEMENT MATRIX</h3>
            <p className="text-xs text-slate-400">Verified delta before vs after IBM Bob remediation & re-analysis</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
          ✓ RELEASE READY
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Metric</th>
              <th className="py-2.5 px-4 font-semibold text-center text-red-400">BEFORE BOB</th>
              <th className="py-2.5 px-4 font-semibold text-center text-emerald-400">AFTER BOB</th>
              <th className="py-2.5 px-4 font-semibold text-right">IMPROVEMENT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-200">{row.label}</td>
                <td className="py-3 px-4 text-center font-bold text-slate-400 bg-red-500/5">{row.before}</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-500/10">{row.after}</td>
                <td className="py-3 px-4 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>IMPROVED</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
