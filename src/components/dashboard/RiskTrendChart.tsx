'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

export function RiskTrendChart() {
  const { analysis } = useDemo();

  const currentScore = analysis.overallRiskScore;

  const data = [
    { release: '#175', risk: 42 },
    { release: '#176', risk: 38 },
    { release: '#177', risk: 51 },
    { release: '#178', risk: 44 },
    { release: '#179', risk: 67 },
    { release: '#180', risk: 59 },
    { release: '#181', risk: 48 },
    { release: '#182', risk: 31 },
    { release: '#183', risk: 18 },
    { release: '#184', risk: currentScore },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white text-base font-mono">Release Risk Trend</h3>
          <p className="text-xs text-slate-400">Risk score progression across last 10 deployments</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span className="text-slate-300">Risk Index</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="release" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
              labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
            />
            <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Risk Threshold (50)', fill: '#f87171', fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6', stroke: '#1d4ed8' }}
              activeDot={{ r: 7, fill: '#60a5fa' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
