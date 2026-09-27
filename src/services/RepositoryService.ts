import { Repository, PullRequest } from '@/types';

export const DEMO_REPOSITORIES: Repository[] = [
  {
    id: 'payment-service',
    name: 'payment-service',
    owner: 'Acme Engineering',
    language: 'Node.js / TypeScript',
    defaultBranch: 'main',
    lastAnalyzed: '2 minutes ago',
    riskLevel: 'HIGH',
    openIssuesCount: 12,
    criticalIssuesCount: 2,
    pullRequestCount: 3,
    description: 'Core payment processing and credit card authorization microservice.'
  },
  {
    id: 'user-service',
    name: 'user-service',
    owner: 'Acme Engineering',
    language: 'Python / FastAPI',
    defaultBranch: 'main',
    lastAnalyzed: '3 hours ago',
    riskLevel: 'LOW',
    openIssuesCount: 2,
    criticalIssuesCount: 0,
    pullRequestCount: 1,
    description: 'User identity, SSO, and permission management API.'
  },
  {
    id: 'order-service',
    name: 'order-service',
    owner: 'Acme Engineering',
    language: 'TypeScript / Express',
    defaultBranch: 'main',
    lastAnalyzed: 'Yesterday',
    riskLevel: 'MEDIUM',
    openIssuesCount: 4,
    criticalIssuesCount: 0,
    pullRequestCount: 2,
    description: 'Order lifecycle management, inventory sync, and checkout service.'
  }
];

export const DEMO_PRS: PullRequest[] = [
  {
    id: '142',
    number: 142,
    title: 'Improve payment processing and gateway retry logic',
    repositoryId: 'payment-service',
    author: 'Alex Morgan',
    branch: 'feature/payment-v2',
    targetBranch: 'main',
    status: 'open',
    riskLevel: 'HIGH',
    filesChangedCount: 18,
    additions: 427,
    deletions: 103,
    createdAt: '2 hours ago',
    commitHash: '8f3a921'
  },
  {
    id: '141',
    number: 141,
    title: 'Add automated refund support & customer credit memo',
    repositoryId: 'payment-service',
    author: 'Sarah Chen',
    branch: 'feature/refund-flow',
    targetBranch: 'main',
    status: 'merged',
    riskLevel: 'LOW',
    filesChangedCount: 6,
    additions: 120,
    deletions: 15,
    createdAt: 'Yesterday',
    commitHash: '4bc821a'
  },
  {
    id: '140',
    number: 140,
    title: 'Update OAuth2 token validation security middleware',
    repositoryId: 'payment-service',
    author: 'Michael Ross',
    branch: 'fix/auth-middleware',
    targetBranch: 'main',
    status: 'merged',
    riskLevel: 'MEDIUM',
    filesChangedCount: 4,
    additions: 45,
    deletions: 22,
    createdAt: '3 days ago',
    commitHash: '9fa812c'
  }
];

export class RepositoryService {
  getRepositories(): Repository[] {
    return DEMO_REPOSITORIES;
  }

  getRepositoryById(id: string): Repository | undefined {
    return DEMO_REPOSITORIES.find(r => r.id === id);
  }

  getPullRequests(repositoryId: string): PullRequest[] {
    return DEMO_PRS.filter(pr => pr.repositoryId === repositoryId);
  }
}
