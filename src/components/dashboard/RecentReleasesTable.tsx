'use client';

import React from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { GitCommit, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

export function RecentReleasesTable() {
  const { analysis } = useDemo();

  const currentStatus = analysis.status;
  const currentRisk = analysis.overallRiskScore;

  const releases = [
    {
      id: '184',
      number: '#184',
      repo: 'payment-service',
      commit: '8f3a921',
      risk: currentRisk,
      issues: analysis.issues.filter(i => i.status === 'open').length,
      status: currentStatus === 'blocked' ? 'Blocked' : 'Approved',
      analyzedAt: analysis.analyzedAt,
      isCurrent: true
    },
    {
      id: '183',
      number: '#183',
      repo: 'user-service',
      commit: '4bc821a',
      risk: 18,
      issues: 2,
      status: 'Approved',
      analyzedAt: '3h ago',
      isCurrent: false
    },
    {
      id: '182',
      number: '#182',
      repo: 'order-service',
      commit: '9fa812c',
      risk: 31,
      issues: 4,
      status: 'Approved',
      analyzedAt: 'Yesterday',
      isCurrent: false
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-white text-base font-mono">Recent Releases</h3>
        <span className="text-xs text-slate-400 font-mono">Showing 3 most recent</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs font-mono uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-3 font-semibold">Release</th>
              <th className="px-6 py-3 font-semibold">Repository</th>
              <th className="px-6 py-3 font-semibold">Commit</th>
              <th className="px-6 py-3 font-semibold">Risk Score</th>
              <th className="px-6 py-3 font-semibold">Issues</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Analyzed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {releases.map((rel) => (
              <tr
                key={rel.id}
                className={clsx(
                  'hover:bg-slate-800/40 transition',
                  rel.isCurrent && 'bg-blue-600/5'
                )}
              >
                <td className="px-6 py-4 font-bold text-slate-100 flex items-center gap-2">
                  <Link href={`/releases/${rel.id}`} className="hover:text-blue-400 flex items-center gap-1">
                    {rel.number}
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-200">{rel.repo}</td>
                <td className="px-6 py-4 text-slate-400">
                  <span className="inline-flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-xs text-slate-300">
                    <GitCommit className="w-3 h-3 text-slate-500" />
                    {rel.commit}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={clsx(
                      'font-bold text-xs px-2 py-0.5 rounded border',
                      rel.risk >= 50
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : rel.risk >= 30
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    )}
                  >
                    {rel.risk} / 100
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">{rel.issues}</td>
                <td className="px-6 py-4">
                  <span
                    className={clsx(
                      'text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border',
                      rel.status === 'Approved'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                    )}
                  >
                    ● {rel.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-400 text-xs">{rel.analyzedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
