'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Sliders, Bell, GitBranch, Bot, Database } from 'lucide-react';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(30);
  const [blockOnCritical, setBlockOnCritical] = useState(true);
  const [blockOnHigh, setBlockOnHigh] = useState(true);
  const [blockOnTestFail, setBlockOnTestFail] = useState(true);
  const [blockOnVuln, setBlockOnVuln] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = () => {
    setToastMsg('Release policy and analysis rules updated!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Application Settings</h1>
        <p className="text-sm text-slate-400 font-sans mt-1">Configure integrations, automated release block policies, and analysis thresholds.</p>
      </div>

      {toastMsg && (
        <div className="bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-lg text-xs">
          ✓ {toastMsg}
        </div>
      )}

      {/* Integrations Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-400" />
          <span>Integrations & Connections</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-white">GH</div>
              <div>
                <div className="font-bold text-slate-200">GitHub Enterprise</div>
                <div className="text-slate-400">Webhooks & PR Checks</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Connected ✓
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">BOB</div>
              <div>
                <div className="font-bold text-slate-200">IBM Bob AI Agent</div>
                <div className="text-slate-400">Auto-Fix & Spec Generator</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Connected ✓
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-slate-500 flex items-center justify-center font-bold">CI</div>
              <div>
                <div className="font-bold text-slate-200">CI/CD Pipeline</div>
                <div className="text-slate-400">Actions / Jenkins</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 font-bold">
              Not Connected
            </span>
          </div>
        </div>
      </div>

      {/* Release Policies */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-400" />
          <span>Automated Release Block Policy</span>
        </h2>

        <div className="space-y-4 text-xs font-sans">
          <div className="font-mono font-bold text-slate-300">BLOCK RELEASE WHEN:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={blockOnCritical}
                onChange={(e) => setBlockOnCritical(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
              />
              <span className="text-slate-200 font-bold">Critical Security Issue Detected</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={blockOnHigh}
                onChange={(e) => setBlockOnHigh(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
              />
              <span className="text-slate-200 font-bold">High Security / Reliability Issue</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={blockOnTestFail}
                onChange={(e) => setBlockOnTestFail(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
              />
              <span className="text-slate-200 font-bold">Unit / Regression Test Failure</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={blockOnVuln}
                onChange={(e) => setBlockOnVuln(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
              />
              <span className="text-slate-200 font-bold">Dependency SSRF Vulnerability</span>
            </label>
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300 font-bold">Risk Score Threshold Cutoff:</span>
              <span className="text-blue-400 font-bold">{threshold} / 100</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-[11px] text-slate-400 font-sans">
              Releases with calculated overall risk index above {threshold} will automatically be marked as <strong className="text-red-400 font-mono uppercase">RELEASE BLOCKED</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20"
        >
          Save Policy Rules
        </button>
      </div>
    </div>
  );
}
