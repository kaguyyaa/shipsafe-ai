'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { RepositoryService } from '@/services/RepositoryService';
import { useDemo } from '@/context/DemoContext';
import { GitPullRequest, GitCommit, ShieldCheck, AlertCircle, Play, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

export default function RepositoryDetailPage() {
  const params = useParams();
  const repoId = (params?.id as string) || 'payment-service';

  const repoService = new RepositoryService();
  const repo = repoService.getRepositoryById(repoId) || repoService.getRepositories()[0];
  const pullRequests = repoService.getPullRequests(repoId);
  const { analysis, reanalyze, isReanalyzing } = useDemo();

  const [activeTab, setActiveTab] = useState<'overview' | 'pulls' | 'releases' | 'issues'>('overview');

  const activeIssues = analysis.issues.filter(i => i.status === 'open');
  const criticalCount = activeIssues.filter(i => i.severity === 'critical').length;
  const highCount = activeIssues.filter(i => i.severity === 'high').length;
  const mediumCount = activeIssues.filter(i => i.severity === 'medium').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">{repo.name}</h1>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              GitHub: main
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{repo.description}</p>
        </div>

        <button
          onClick={() => reanalyze()}
          disabled={isReanalyzing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          <span>[ Analyze Release ]</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-4 border-b border-slate-800 text-xs">
        {(['overview', 'pulls', 'releases', 'issues'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'pb-3 font-bold uppercase tracking-wider transition border-b-2',
              activeTab === tab
                ? 'text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            )}
          >
            {tab === 'pulls' ? 'Pull Requests (3)' : tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Health Scores */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Repository Health Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Security</div>
                <div className="text-2xl font-extrabold text-blue-400 mt-1">{analysis.categoryScores.security} / 100</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Reliability</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">{analysis.categoryScores.reliability} / 100</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Testing Coverage</div>
                <div className="text-2xl font-extrabold text-purple-400 mt-1">{analysis.testCoveragePercent}%</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Dependencies</div>
                <div className="text-2xl font-extrabold text-indigo-400 mt-1">{analysis.categoryScores.dependencies} / 100</div>
              </div>
            </div>
          </div>

          {/* Grid: Commits & Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Commits */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Recent Commits</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-200">Improve payment processing</div>
                    <div className="text-slate-400">Alex Morgan • 2 minutes ago</div>
                  </div>
                  <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-blue-400">8f3a921</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-200">Add payment retry logic</div>
                    <div className="text-slate-400">Sarah Chen • Yesterday</div>
                  </div>
                  <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-slate-400">4bc821a</span>
                </div>
              </div>
            </div>

            {/* Analysis Breakdown */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Recent Analysis Breakdown</h3>
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div className="text-slate-300 font-bold">
                  {activeIssues.length} issues detected
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-center font-bold">
                    {criticalCount} Critical
                  </div>
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-center font-bold">
                    {highCount} High
                  </div>
                  <div className="p-2 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-center font-bold">
                    {mediumCount} Medium
                  </div>
                </div>
                <Link
                  href="/releases/184"
                  className="inline-flex items-center gap-1.5 text-blue-400 hover:underline pt-2"
                >
                  <span>View Release #184 Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PULL REQUESTS TAB */}
      {activeTab === 'pulls' && (
        <div className="space-y-4">
          {pullRequests.map((pr) => (
            <div
              key={pr.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">#{pr.number} {pr.title}</span>
                  <span
                    className={clsx(
                      'text-xs px-2.5 py-0.5 rounded font-bold uppercase',
                      pr.status === 'open' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    )}
                  >
                    {pr.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                    Risk: {pr.riskLevel}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-4">
                  <span>Author: {pr.author}</span>
                  <span>Branch: {pr.branch}</span>
                  <span>{pr.filesChangedCount} files changed (<strong className="text-emerald-400">+{pr.additions}</strong> <strong className="text-red-400">-{pr.deletions}</strong>)</span>
                </div>
              </div>

              <Link
                href="/releases/184"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2"
              >
                <span>Analyze PR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* RELEASES TAB */}
      {activeTab === 'releases' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
          <Link href="/releases/184" className="text-blue-400 hover:underline font-bold text-sm">
            View Release #184 Analysis Page &rarr;
          </Link>
        </div>
      )}

      {/* ISSUES TAB */}
      {activeTab === 'issues' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
          <Link href="/issues" className="text-blue-400 hover:underline font-bold text-sm">
            View All Detected Issues ({activeIssues.length} open) &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
