'use client';

import React, { useState } from 'react';
import { KPICards } from '@/components/dashboard/KPICards';
import { MainRiskCard } from '@/components/dashboard/MainRiskCard';
import { RecentReleasesTable } from '@/components/dashboard/RecentReleasesTable';
import { RiskTrendChart } from '@/components/dashboard/RiskTrendChart';
import { BeforeAfterMatrix } from '@/components/analysis/BeforeAfterMatrix';
import { Plus, RefreshCw } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function DashboardPage() {
  const { reanalyze, isReanalyzing } = useDemo();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAnalyzeClick = async () => {
    setToastMsg('Analyzing release changes across repositories...');
    await reanalyze();
    setToastMsg('ShipSafe analysis completed!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">Release Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Monitor software health and release safety across your repositories.</p>
        </div>

        <button
          onClick={handleAnalyzeClick}
          disabled={isReanalyzing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          {isReanalyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>+ Analyze Release</span>
        </button>
      </div>

      {toastMsg && (
        <div className="bg-blue-600/20 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-lg text-xs font-mono animate-fade-in flex items-center justify-between">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <KPICards />

      {/* Before/After Matrix (if fixed) */}
      <BeforeAfterMatrix />

      {/* Main Risk Card */}
      <MainRiskCard />

      {/* Grid: Releases Table & Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentReleasesTable />
        <RiskTrendChart />
      </div>
    </div>
  );
}
