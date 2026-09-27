export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type IssueType = 'security' | 'bug' | 'reliability' | 'dependency' | 'testing' | 'configuration';

export type IssueStatus = 'open' | 'fixing' | 'resolved' | 'accepted' | 'ignored';

export type ReleaseStatus = 'blocked' | 'approved' | 'analyzing' | 'fixing';

export interface Repository {
  id: string;
  name: string;
  owner: string;
  language: string;
  defaultBranch: string;
  lastAnalyzed: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  openIssuesCount: number;
  criticalIssuesCount: number;
  pullRequestCount: number;
  description: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  repositoryId: string;
  author: string;
  branch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'closed';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  filesChangedCount: number;
  additions: number;
  deletions: number;
  createdAt: string;
  commitHash: string;
}

export interface CategoryScores {
  security: number;      // 0-100 (higher = safer)
  reliability: number;   // 0-100
  testing: number;       // 0-100 (or coverage %)
  dependencies: number;  // 0-100
  changeRisk: number;    // 0-100
}

export interface Issue {
  id: string;
  title: string;
  severity: Severity;
  type: IssueType;
  repositoryId: string;
  file: string;
  line: number;
  description: string;
  explanation: string; // AI generated explanation
  factSnippet: string; // Grounded fact AST match
  recommendation: string;
  status: IssueStatus;
  codeSnippet?: string;
  isFixableByBob?: boolean;
}

export interface ReleaseAnalysis {
  id: string;
  releaseNumber: string;
  repositoryId: string;
  repositoryName: string;
  branch: string;
  commitHash: string;
  analyzedAt: string;
  overallRiskScore: number; // 0-100 (higher = riskier)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: ReleaseStatus;
  categoryScores: CategoryScores;
  testCoveragePercent: number;
  issues: Issue[];
  summary: string;
}

export interface ScenarioStep {
  id: string;
  node: string;
  subtext?: string;
  status: 'normal' | 'failed' | 'bypassed';
}

export interface FailureScenario {
  id: string;
  title: string;
  triggerEvent: string;
  severity: Severity;
  steps: ScenarioStep[];
  impactPoints: string[];
}

export interface BobAction {
  id: string;
  issueId: string;
  repositoryId: string;
  task: string;
  status: 'in_progress' | 'completed' | 'failed';
  modifiedFilesCount: number;
  testsAddedCount: number;
  durationSeconds: number;
  timestamp: string;
  beforeCode?: string;
  afterCode?: string;
  generatedTestsCode?: string;
  executionLogs: string[];
}

export interface BeforeAfterMatrix {
  beforeRisk: number;
  afterRisk: number;
  beforeCategory: CategoryScores;
  afterCategory: CategoryScores;
  beforeIssuesCount: { critical: number; high: number; medium: number; low: number };
  afterIssuesCount: { critical: number; high: number; medium: number; low: number };
  testsAdded: number;
}
