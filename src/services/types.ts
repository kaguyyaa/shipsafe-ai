import { ReleaseAnalysis, FailureScenario, BobAction, Issue } from '@/types';

export interface IAnalysisService {
  analyzeRelease(releaseId: string, repositoryId: string, customCode?: string): Promise<ReleaseAnalysis>;
  analyzePullRequest(prId: string): Promise<ReleaseAnalysis>;
  runFailureSimulation(scenarioId: string): Promise<FailureScenario>;
  calculateRiskScore(issues: Issue[], testCoverage: number, filesChanged: number): number;
}

export interface IBobService {
  fixIssue(issueId: string, repositoryId: string, currentCode?: string): Promise<{
    action: BobAction;
    fixedCode: string;
    generatedTests: string;
  }>;
}
