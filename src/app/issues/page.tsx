'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { AlertTriangle, ArrowRight, Bot, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { BobExecutionModal } from '@/components/bob/BobExecutionModal';

export default function IssuesPage() {
  const { analysis, runBobFix } = useDemo();
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isBobModalOpen, setIsBobModalOpen] = useState(false);

  const activeIssues = analysis.issues.filter(i => i.status === 'open');

  const filteredIssues = activeIssues.filter(issue => {
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && issue.type !== selectedType) return false;
    return true;
  });

  const handleFixClick = async (issueId: string) => {
    setIsBobModalOpen(true);
    await runBobFix(issueId);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Detected Issues</h1>
        <p className="text-sm text-slate-400 font-sans mt-1">Review security vulnerabilities, reliability risks, and test gaps across repositories.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400">Severity:</label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400">Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="security">Security</option>
            <option value="reliability">Reliability</option>
            <option value="testing">Testing</option>
            <option value="dependency">Dependency</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <div
            key={issue.id}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-3">
                <span
                  className={clsx(
                    'text-xs px-2.5 py-0.5 rounded font-bold uppercase',
                    issue.severity === 'critical'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : issue.severity === 'high'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  )}
                >
                  {issue.severity}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                  {issue.type}
                </span>
                <h3 className="font-bold text-white text-base">{issue.title}</h3>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">{issue.description}</p>
              <div className="text-xs text-slate-500 font-mono">
                {issue.repositoryId} • {issue.file}:{issue.line}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/issues/pay-142`}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                [View Issue]
              </Link>
              {issue.isFixableByBob && (
                <button
                  onClick={() => handleFixClick(issue.id)}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4 text-blue-200" />
                  <span>[ Fix with IBM Bob ]</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <BobExecutionModal isOpen={isBobModalOpen} onClose={() => setIsBobModalOpen(false)} />
    </div>
  );
}
