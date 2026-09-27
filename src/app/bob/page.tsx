'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { Bot, CheckCircle2, FileCode, Clock, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export default function BobActionsPage() {
  const { bobAction } = useDemo();

  const history = [
    ...(bobAction
      ? [
          {
            id: bobAction.id,
            repo: 'payment-service',
            task: bobAction.task,
            result: 'Completed',
            filesChanged: bobAction.modifiedFilesCount,
            testsAdded: bobAction.testsAddedCount,
            duration: `${bobAction.durationSeconds}s`,
            status: 'Successful',
            timestamp: bobAction.timestamp
          }
        ]
      : []),
    {
      id: 'bob-act-290',
      repo: 'payment-service',
      task: 'Fix unhandled payment provider failure & add 6 regression tests',
      result: 'Completed',
      filesChanged: 3,
      testsAdded: 6,
      duration: '42 seconds',
      status: 'Successful',
      timestamp: '2 hours ago'
    },
    {
      id: 'bob-act-289',
      repo: 'payment-service',
      task: 'Update vulnerable axios dependency to v1.6.0',
      result: 'Completed',
      filesChanged: 2,
      testsAdded: 2,
      duration: '18 seconds',
      status: 'Successful',
      timestamp: 'Yesterday'
    }
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">IBM Bob Actions History</h1>
        </div>
        <p className="text-sm text-slate-400 font-sans mt-1">Audit log of autonomous AI software engineer refactoring tasks & generated tests.</p>
      </div>

      {/* History Cards */}
      <div className="space-y-4">
        {history.map((item, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 font-bold">{item.id}</span>
                <span className="text-xs text-slate-300 font-bold">{item.repo}</span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {item.timestamp}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-white text-base">{item.task}</h3>
              <p className="text-xs text-slate-400 font-sans">Automated patch synthesized, verified by Jest test runner.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500">Status</div>
                <div className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.status}</span>
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500">Files Changed</div>
                <div className="font-bold text-slate-200 mt-0.5">{item.filesChanged} files</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500">Tests Added</div>
                <div className="font-bold text-purple-400 mt-0.5">{item.testsAdded} regression tests</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500">Duration</div>
                <div className="font-bold text-slate-200 mt-0.5">{item.duration}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
