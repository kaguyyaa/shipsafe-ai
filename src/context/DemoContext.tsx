'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReleaseAnalysis, BobAction, FailureScenario, Issue } from '@/types';
import { MockAnalysisService } from '@/services/MockAnalysisService';
import { RealAnalysisService } from '@/services/RealAnalysisService';
import { MockBobService, BEFORE_CODE_PAYMENT_SERVICE } from '@/services/MockBobService';
import { RealBobService } from '@/services/RealBobService';

interface DemoContextType {
  mode: 'demo' | 'real';
  setMode: (mode: 'demo' | 'real') => void;
  analysis: ReleaseAnalysis;
  isFixed: boolean;
  currentCode: string;
  bobAction: BobAction | null;
  isBobWorking: boolean;
  bobStepIndex: number;
  isReanalyzing: boolean;
  activeScenario: FailureScenario | null;
  runBobFix: (issueId?: string) => Promise<void>;
  reanalyze: () => Promise<void>;
  resetDemo: () => Promise<void>;
  selectScenario: (scenarioId: string) => Promise<void>;
  bobLogs: string[];
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'demo' | 'real'>('demo');
  const [isFixed, setIsFixed] = useState(false);
  const [currentCode, setCurrentCode] = useState(BEFORE_CODE_PAYMENT_SERVICE);
  const [bobAction, setBobAction] = useState<BobAction | null>(null);
  const [isBobWorking, setIsBobWorking] = useState(false);
  const [bobStepIndex, setBobStepIndex] = useState(0);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [activeScenario, setActiveScenario] = useState<FailureScenario | null>(null);
  const [bobLogs, setBobLogs] = useState<string[]>([]);

  const mockAnalysis = new MockAnalysisService();
  const realAnalysis = new RealAnalysisService();
  const mockBob = new MockBobService();
  const realBob = new RealBobService();

  const currentAnalysisService = mode === 'demo' ? mockAnalysis : realAnalysis;
  const currentBobService = mode === 'demo' ? mockBob : realBob;

  const [analysis, setAnalysis] = useState<ReleaseAnalysis>({
    id: '184',
    releaseNumber: '#184',
    repositoryId: 'payment-service',
    repositoryName: 'payment-service',
    branch: 'feature/payment-v2',
    commitHash: '8f3a921',
    analyzedAt: '2 minutes ago',
    overallRiskScore: 72,
    riskLevel: 'HIGH',
    status: 'blocked',
    categoryScores: { security: 82, reliability: 61, testing: 48, dependencies: 79, changeRisk: 67 },
    testCoveragePercent: 68,
    issues: [],
    summary: 'ShipSafe detected release-blocking issues.'
  });

  // Load initial analysis on mount or mode change
  useEffect(() => {
    currentAnalysisService.analyzeRelease('184', 'payment-service', currentCode).then(setAnalysis);
    currentAnalysisService.runFailureSimulation('http-500').then(setActiveScenario);
  }, [mode]);

  const selectScenario = async (scenarioId: string) => {
    const sc = await currentAnalysisService.runFailureSimulation(scenarioId);
    setActiveScenario(sc);
  };

  const runBobFix = async (issueId: string = 'PAY-142') => {
    setIsBobWorking(true);
    setBobStepIndex(0);
    setBobLogs(['Initiating IBM Bob AI Agent...']);

    const steps = [
      'Analyzed repository AST & dependency graph',
      'Located vulnerable implementation at src/payments/paymentService.ts:112',
      'Injecting PaymentProviderError exception handler',
      'Generating 6 Jest regression tests in tests/payment.test.ts',
      'Executing test runner... 6 passed, 0 failed',
      'Validating code diff safety'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setBobStepIndex(i + 1);
      setBobLogs((prev) => [...prev, steps[i]]);
    }

    const result = await currentBobService.fixIssue(issueId, 'payment-service', currentCode);
    setCurrentCode(result.fixedCode);
    setBobAction(result.action);
    setIsFixed(true);
    setIsBobWorking(false);
  };

  const reanalyze = async () => {
    setIsReanalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newAnalysis = await currentAnalysisService.analyzeRelease('184', 'payment-service', currentCode);
    setAnalysis(newAnalysis);
    setIsReanalyzing(false);
  };

  const resetDemo = async () => {
    setIsFixed(false);
    setCurrentCode(BEFORE_CODE_PAYMENT_SERVICE);
    setBobAction(null);
    setBobStepIndex(0);
    setBobLogs([]);
    const initialAnalysis = await currentAnalysisService.analyzeRelease('184', 'payment-service', BEFORE_CODE_PAYMENT_SERVICE);
    setAnalysis(initialAnalysis);
  };

  return (
    <DemoContext.Provider
      value={{
        mode,
        setMode,
        analysis,
        isFixed,
        currentCode,
        bobAction,
        isBobWorking,
        bobStepIndex,
        isReanalyzing,
        activeScenario,
        runBobFix,
        reanalyze,
        resetDemo,
        selectScenario,
        bobLogs
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
