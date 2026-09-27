'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { Bell, RefreshCw, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export function TopNav() {
  const { mode, setMode, resetDemo, isReanalyzing, isBobWorking } = useDemo();

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-slate-400">ShipSafe</span>
        <span className="text-slate-600 font-mono">/</span>
        <span className="text-slate-100 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-xs">
          payment-service
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Operational Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Analysis Status: <strong className="text-emerald-400 font-normal">Operational</strong></span>
        </div>

        {/* Engine Mode Switcher */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMode('demo')}
            className={clsx(
              'px-2.5 py-1 rounded-md transition-all font-mono font-medium',
              mode === 'demo'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Demo Mode
          </button>
          <button
            onClick={() => setMode('real')}
            className={clsx(
              'px-2.5 py-1 rounded-md transition-all font-mono font-medium flex items-center gap-1',
              mode === 'real'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <ShieldCheck className="w-3 h-3 text-indigo-300" />
            Real SAST Engine
          </button>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={resetDemo}
          disabled={isReanalyzing || isBobWorking}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition font-medium disabled:opacity-50"
          title="Reset Demo State back to initial Release Blocked state"
        >
          <RefreshCw className={clsx('w-3.5 h-3.5 text-blue-400', (isReanalyzing || isBobWorking) && 'animate-spin')} />
          <span>Reset Demo</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
          AM
        </div>
      </div>
    </header>
  );
}
