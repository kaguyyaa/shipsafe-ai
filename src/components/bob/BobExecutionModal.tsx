'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { CodeDiffViewer } from './CodeDiffViewer';
import { GeneratedTestsViewer } from './GeneratedTestsViewer';
import { Bot, CheckCircle2, Loader2, ArrowRight, X, Sparkles, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface BobExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BobExecutionModal({ isOpen, onClose }: BobExecutionModalProps) {
  const { isBobWorking, bobStepIndex, bobLogs, isFixed, reanalyze, isReanalyzing } = useDemo();

  if (!isOpen) return null;

  const handleReanalyzeClick = async () => {
    await reanalyze();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">IBM Bob AI Software Engineer</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">v2.4 Agent</span>
              </div>
              <p className="text-xs text-slate-400">Automated Code Remediation & Regression Spec Generator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Working vs Completed Status Banner */}
          <div
            className={clsx(
              'p-4 rounded-xl border font-mono flex items-center justify-between transition-all',
              isBobWorking
                ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                : isFixed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-300'
            )}
          >
            <div className="flex items-center gap-3">
              {isBobWorking ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              ) : isFixed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Bot className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {isBobWorking ? 'IBM BOB IS WORKING...' : isFixed ? 'IBM BOB REMEDIATION COMPLETED' : 'READY TO START'}
                </div>
                <div className="text-xs opacity-80">
                  {isBobWorking
                    ? 'Refactoring paymentService.ts & generating regression tests'
                    : isFixed
                    ? '3 files modified, 6 regression tests added, all tests passed'
                    : 'Fix unhandled payment provider failure'}
                </div>
              </div>
            </div>

            {isFixed && (
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                ✓ FIX READY
              </span>
            )}
          </div>

          {/* Timeline Execution Steps */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-slate-400 font-semibold mb-2">EXECUTION LOGS & TIMELINE:</div>
            {bobLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{log}</span>
              </div>
            ))}
            {isBobWorking && (
              <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing step {bobStepIndex + 1}...</span>
              </div>
            )}
          </div>

          {/* Show Code Diff and Generated Tests once finished */}
          {isFixed && (
            <div className="space-y-6">
              <CodeDiffViewer />
              <GeneratedTestsViewer />
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between sticky bottom-0 z-10">
          <span className="text-xs text-slate-400 font-mono">
            {isFixed ? 'Remediation applied to working tree' : 'Click close to exit'}
          </span>

          {isFixed && (
            <button
              onClick={handleReanalyzeClick}
              disabled={isReanalyzing}
              className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20 font-mono disabled:opacity-50"
            >
              {isReanalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Re-analyzing Release...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Re-run ShipSafe Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
