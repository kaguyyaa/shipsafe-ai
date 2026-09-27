'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RepositoryService } from '@/services/RepositoryService';
import { FolderGit2, Plus, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useDemo } from '@/context/DemoContext';

export default function RepositoriesPage() {
  const repoService = new RepositoryService();
  const repositories = repoService.getRepositories();
  const { analysis } = useDemo();

  const [showConnectModal, setShowConnectModal] = useState(false);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Repositories</h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">Connect and monitor your software projects.</p>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Connect Repository</span>
        </button>
      </div>

      {/* Connect Modal Mock */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Connect GitHub Repository</h3>
            <p className="text-xs text-slate-400 font-sans">
              Select an organization or personal GitHub repository to install the ShipSafe AI release safety scanner bot.
            </p>
            <input
              type="text"
              placeholder="acme/service-name"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 text-xs bg-blue-600 text-white font-bold rounded-lg"
              >
                Connect Repo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repository Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {repositories.map((repo) => {
          const isPayment = repo.id === 'payment-service';
          const riskLevel = isPayment ? analysis.riskLevel : repo.riskLevel;
          const openIssues = isPayment ? analysis.issues.filter(i => i.status === 'open').length : repo.openIssuesCount;
          const isHigh = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';

          return (
            <div
              key={repo.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-sm group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 font-bold">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition">{repo.name}</h3>
                      <span className="text-xs text-slate-400 font-sans">{repo.language}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                  {repo.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                  <span className="text-slate-400">Branch: <strong className="text-slate-200">{repo.defaultBranch}</strong></span>
                  <span className="text-slate-400">Analyzed {repo.lastAnalyzed}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span
                  className={clsx(
                    'text-xs px-2.5 py-1 rounded-md font-bold uppercase border flex items-center gap-1.5',
                    isHigh
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  )}
                >
                  {isHigh ? <ShieldAlert className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Risk: {riskLevel} ({openIssues} issues)
                </span>

                <Link
                  href={`/repositories/${repo.id}`}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
