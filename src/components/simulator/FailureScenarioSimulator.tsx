'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { Play, AlertTriangle, ArrowRight, XCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export function FailureScenarioSimulator() {
  const { activeScenario, selectScenario } = useDemo();
  const [isSimulating, setIsSimulating] = useState(false);

  if (!activeScenario) return null;

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsSimulating(true);
    selectScenario(e.target.value);
    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-base font-mono">Failure Scenario Simulation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Simulate upstream fault injection and runtime error propagation</p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-mono">Preset Scenario:</label>
          <select
            value={activeScenario.id}
            onChange={handleScenarioChange}
            className="bg-slate-950 text-xs font-mono text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="http-500">Payment Provider HTTP 500</option>
            <option value="db-loss">Database Connection Lost</option>
            <option value="timeout">Payment Provider Timeout (&gt;10s)</option>
          </select>
        </div>
      </div>

      {/* Visual Trace Flow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>RUNTIME EXECUTION TRACE</span>
          <span>SEVERITY: <strong className="text-red-400 uppercase">{activeScenario.severity}</strong></span>
        </div>

        <div className={clsx('grid grid-cols-1 md:grid-cols-6 gap-2 transition-all', isSimulating && 'opacity-50')}>
          {activeScenario.steps.map((step, idx) => {
            const isError = step.status === 'failed';

            return (
              <div key={step.id} className="relative flex flex-col items-center">
                <div
                  className={clsx(
                    'w-full p-3 rounded-lg border text-center text-xs font-mono flex flex-col items-center justify-center min-h-[72px] transition',
                    isError
                      ? 'bg-red-500/10 border-red-500/40 text-red-300 font-bold shadow-sm shadow-red-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  )}
                >
                  {isError ? <XCircle className="w-4 h-4 text-red-400 mb-1" /> : <CheckCircle className="w-3.5 h-3.5 text-blue-400 mb-1" />}
                  <span>{step.node}</span>
                </div>
                {idx < activeScenario.steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Breakdown */}
      <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>POTENTIAL IMPACT ASSESSMENT</span>
        </div>
        <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside font-mono">
          {activeScenario.impactPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
