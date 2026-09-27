'use client';

import React from 'react';
import { AFTER_CODE_PAYMENT_SERVICE, BEFORE_CODE_PAYMENT_SERVICE } from '@/services/MockBobService';

interface CodeDiffViewerProps {
  beforeCode?: string;
  afterCode?: string;
}

export function CodeDiffViewer({
  beforeCode = BEFORE_CODE_PAYMENT_SERVICE,
  afterCode = AFTER_CODE_PAYMENT_SERVICE
}: CodeDiffViewerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>AFFECTED FILE: <strong className="text-blue-400">src/payments/paymentService.ts</strong></span>
        <span>BEFORE / AFTER CODE DIFF</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* BEFORE BLOCK */}
        <div className="bg-slate-950 border border-red-500/30 rounded-lg p-4 overflow-x-auto">
          <div className="text-[11px] font-bold text-red-400 uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            BEFORE (Vulnerable Implementation)
          </div>
          <pre className="text-slate-300 leading-relaxed">
            <code>{beforeCode}</code>
          </pre>
        </div>

        {/* AFTER BLOCK */}
        <div className="bg-slate-950 border border-emerald-500/30 rounded-lg p-4 overflow-x-auto">
          <div className="text-[11px] font-bold text-emerald-400 uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            AFTER (IBM Bob Remediated)
          </div>
          <pre className="text-emerald-300/90 leading-relaxed">
            <code>{afterCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
