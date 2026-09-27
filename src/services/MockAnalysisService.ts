import { IAnalysisService } from './types';
import { ReleaseAnalysis, FailureScenario, Issue } from '@/types';

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'PAY-142',
    title: 'Unhandled Payment Provider Failure',
    severity: 'high',
    type: 'reliability',
    repositoryId: 'payment-service',
    file: 'src/payments/paymentService.ts',
    line: 112,
    description: 'A provider timeout or HTTP 500 error causes an unhandled exception and leaves the order in an inconsistent state.',
    explanation: 'ShipSafe detected a failure path where the payment provider returns an error or times out. The current implementation does not handle the response safely, causing unhandled exceptions in production.',
    factSnippet: 'const response = await paymentProvider.charge(order); return response.transactionId;',
    recommendation: 'Wrap gateway call in try/catch block, handle null or error responses gracefully, and throw a typed PaymentProviderError.',
    status: 'open',
    codeSnippet: `async function processPayment(order: PaymentOrder): Promise<string> {
  const response = await paymentProvider.charge(order);

  return response.transactionId;
}`,
    isFixableByBob: true,
  },
  {
    id: 'SEC-101',
    title: 'SQL Injection in Order Lookup',
    severity: 'critical',
    type: 'security',
    repositoryId: 'payment-service',
    file: 'src/orders/orderService.ts',
    line: 84,
    description: 'User-controlled orderId is directly inserted into a SQL query string.',
    explanation: 'Raw string interpolation inside SQL query allows parameter injection, exposing sensitive transaction history.',
    factSnippet: "const query = `SELECT * FROM orders WHERE id = '${orderId}' AND is_active = true`;",
    recommendation: 'Use parameterized queries ($1, $2) or an ORM query builder.',
    status: 'open',
    codeSnippet: `async function getOrderById(orderId: string) {
  const query = \`SELECT * FROM orders WHERE id = '\${orderId}' AND is_active = true\`;
  return await db.query(query);
}`,
    isFixableByBob: true,
  },
  {
    id: 'SEC-102',
    title: 'Missing Authorization Check on Cancel Order',
    severity: 'high',
    type: 'security',
    repositoryId: 'payment-service',
    file: 'src/orders/orderController.ts',
    line: 54,
    description: 'Endpoint updates order state without validating caller ownership or scope.',
    explanation: 'Any authenticated API consumer can pass arbitrary orderId to trigger cancellation.',
    factSnippet: "const updatedOrder = await req.orderService.updateStatus(orderId, 'CANCELLED');",
    recommendation: 'Add user context verification guard before invoking orderService.',
    status: 'open',
    codeSnippet: `async function cancelOrder(req, res) {
  const { orderId } = req.params;
  const updatedOrder = await req.orderService.updateStatus(orderId, 'CANCELLED');
  return res.json({ success: true, order: updatedOrder });
}`,
    isFixableByBob: true,
  },
  {
    id: 'DEP-301',
    title: 'Vulnerable axios Dependency Version',
    severity: 'high',
    type: 'dependency',
    repositoryId: 'payment-service',
    file: 'package.json',
    line: 12,
    description: 'axios v0.21.1 contains known Server-Side Request Forgery (SSRF) vulnerability (CVE-2021-3749).',
    explanation: 'Using unpatched axios version exposes internal HTTP endpoints to SSRF vector.',
    factSnippet: '"axios": "0.21.1"',
    recommendation: 'Upgrade axios to v1.6.0 or higher.',
    status: 'open',
    codeSnippet: `"dependencies": {
  "axios": "0.21.1",
  "express": "^4.18.2"
}`,
    isFixableByBob: true,
  },
  {
    id: 'TST-201',
    title: 'Missing Payment Failure Regression Test',
    severity: 'medium',
    type: 'testing',
    repositoryId: 'payment-service',
    file: 'tests/payment.test.ts',
    line: 15,
    description: 'The newly modified payment flow has no test covering gateway timeout or 500 error scenarios.',
    explanation: 'Test suite only verifies happy-path payment charges.',
    factSnippet: "describe('PaymentService Unit Tests', () => { it('should process payment successfully...'",
    recommendation: 'Add unit tests for HTTP 500, timeout, and missing transaction ID responses.',
    status: 'open',
    codeSnippet: `it('should process payment successfully when gateway is healthy', async () => {
  const txId = await processPayment(order);
  expect(txId).toBeDefined();
});`,
    isFixableByBob: true,
  },
  {
    id: 'HYG-001',
    title: 'Floating Express Dependency Version',
    severity: 'medium',
    type: 'dependency',
    repositoryId: 'payment-service',
    file: 'package.json',
    line: 13,
    description: 'Caret dependency range allows non-deterministic builds across deployments.',
    explanation: 'Pin exact package versions using package-lock.json or strict version specs.',
    factSnippet: '"express": "^4.18.2"',
    recommendation: 'Pin express version to 4.18.2.',
    status: 'open',
  },
  {
    id: 'HYG-002',
    title: 'Uncaught Promise Rejection in Logger Middleware',
    severity: 'medium',
    type: 'reliability',
    repositoryId: 'payment-service',
    file: 'src/middleware/logger.ts',
    line: 32,
    description: 'Async log writing lacks catch block, potentially crashing node process on disk full.',
    explanation: 'Unhandled promise rejections crash Node.js process runtime.',
    factSnippet: 'fs.appendFile(logPath, msg);',
    recommendation: 'Attach .catch() handler or await in try block.',
    status: 'open',
  },
  {
    id: 'HYG-003',
    title: 'Insecure JWT Default Secret Fallback',
    severity: 'medium',
    type: 'security',
    repositoryId: 'payment-service',
    file: 'src/auth/jwt.ts',
    line: 18,
    description: 'Fallback secret "secret123" used when process.env.JWT_SECRET is undefined.',
    explanation: 'Hardcoded secret enables signature forgery if environment variable missing.',
    factSnippet: 'const secret = process.env.JWT_SECRET || "secret123";',
    recommendation: 'Throw fatal startup error if secret variable missing.',
    status: 'open',
  },
  {
    id: 'HYG-004',
    title: 'Console Log Leaking PII in Production',
    severity: 'low',
    type: 'security',
    repositoryId: 'payment-service',
    file: 'src/payments/paymentService.ts',
    line: 42,
    description: 'console.log outputs raw credit card last4 and email address.',
    explanation: 'Sensitive customer attributes written to unencrypted stdout streams.',
    factSnippet: 'console.log("Processing order for:", order.customerId, order.email);',
    recommendation: 'Sanitize log payload using structured redactor.',
    status: 'open',
  },
  {
    id: 'HYG-005',
    title: 'Unused DB Connection Pool in Order Service',
    severity: 'low',
    type: 'reliability',
    repositoryId: 'payment-service',
    file: 'src/orders/orderService.ts',
    line: 14,
    description: 'Redundant connection pool initialized per request instead of reusing global pool.',
    explanation: 'Causes database connection exhaustion under moderate concurrency.',
    factSnippet: 'const pool = new Pool();',
    recommendation: 'Inject singleton database connection instance.',
    status: 'open',
  },
  {
    id: 'HYG-006',
    title: 'Missing HTTP Response Timeout Header',
    severity: 'medium',
    type: 'reliability',
    repositoryId: 'payment-service',
    file: 'src/server.ts',
    line: 28,
    description: 'Express app server does not set server.keepAliveTimeout.',
    explanation: 'Can cause 502 Bad Gateway errors behind AWS ALB / Cloudflare proxies.',
    factSnippet: 'app.listen(port);',
    recommendation: 'Configure server.keepAliveTimeout = 65000.',
    status: 'open',
  },
  {
    id: 'HYG-007',
    title: 'Missing Rate Limiting on Payment Route',
    severity: 'medium',
    type: 'security',
    repositoryId: 'payment-service',
    file: 'src/payments/paymentController.ts',
    line: 22,
    description: 'Payment API route lacks rate limiter middleware.',
    explanation: 'Allows automated card testing attacks and request flooding.',
    factSnippet: 'router.post("/process", processPaymentHandler);',
    recommendation: 'Apply express-rate-limit middleware.',
    status: 'open',
  }
];

export const FIXED_ISSUES: Issue[] = INITIAL_ISSUES.filter(
  (i) => i.id !== 'PAY-142' && i.id !== 'SEC-101' && i.id !== 'SEC-102' && i.id !== 'DEP-301' && i.id !== 'TST-201'
).map(i => ({ ...i, status: 'resolved' }));

export const SCENARIOS: Record<string, FailureScenario> = {
  'http-500': {
    id: 'http-500',
    title: 'Payment Provider Returns HTTP 500',
    triggerEvent: 'Gateway Gateway Timeout / 500 Internal Error',
    severity: 'high',
    steps: [
      { id: '1', node: 'Customer Request', status: 'normal' },
      { id: '2', node: 'Payment API Route', status: 'normal' },
      { id: '3', node: 'paymentService.processPayment()', status: 'normal' },
      { id: '4', node: 'Payment Gateway HTTP 500', status: 'failed' },
      { id: '5', node: '❌ Unhandled Gateway Error', status: 'failed' },
      { id: '6', node: 'Order Status Remains PENDING (Inconsistent State)', status: 'failed' }
    ],
    impactPoints: [
      'Failed customer checkout experience',
      'Inconsistent order state in database',
      'Requires manual engineering intervention to reconcile payments'
    ]
  },
  'db-loss': {
    id: 'db-loss',
    title: 'Database Connection Lost Mid-Transaction',
    triggerEvent: 'Postgres Connection Drop',
    severity: 'critical',
    steps: [
      { id: '1', node: 'Customer Request', status: 'normal' },
      { id: '2', node: 'Charge Processed at Gateway', status: 'normal' },
      { id: '3', node: 'DB Write Attempt (order.updateState)', status: 'failed' },
      { id: '4', node: '❌ ECONNREFUSED Database Outage', status: 'failed' },
      { id: '5', node: 'Customer Charged but Order Marked Failed', status: 'failed' }
    ],
    impactPoints: [
      'Double charge risk or phantom charge',
      'Financial discrepancy requiring manual refund',
      'Loss of audit trail'
    ]
  },
  'timeout': {
    id: 'timeout',
    title: 'Payment Provider Latency > 10,000ms',
    triggerEvent: 'Gateway Read Timeout',
    severity: 'high',
    steps: [
      { id: '1', node: 'Customer Request', status: 'normal' },
      { id: '2', node: 'Gateway Request Sent', status: 'normal' },
      { id: '3', node: '10s Socket Hanging', status: 'failed' },
      { id: '4', node: '❌ Node.js HTTP Socket Timeout', status: 'failed' }
    ],
    impactPoints: [
      'App pool thread exhaustion',
      'Cascading service degradation across upstream APIs'
    ]
  }
};

export class MockAnalysisService implements IAnalysisService {
  calculateRiskScore(issues: Issue[], testCoverage: number, filesChanged: number): number {
    const activeIssues = issues.filter((i) => i.status === 'open');
    let points = 0;
    activeIssues.forEach((issue) => {
      if (issue.severity === 'critical') points += 25;
      else if (issue.severity === 'high') points += 15;
      else if (issue.severity === 'medium') points += 8;
      else if (issue.severity === 'low') points += 3;
    });

    const coveragePenalty = Math.max(0, (80 - testCoverage) * 0.5);
    const changePenalty = Math.min(15, filesChanged * 0.5);

    return Math.min(100, Math.round(points + coveragePenalty + changePenalty));
  }

  async analyzeRelease(releaseId: string, repositoryId: string, customCode?: string): Promise<ReleaseAnalysis> {
    const isFixed = customCode ? customCode.includes('PaymentProviderError') || customCode.includes('try {') : false;

    if (isFixed) {
      return {
        id: releaseId,
        releaseNumber: '#184',
        repositoryId: 'payment-service',
        repositoryName: 'payment-service',
        branch: 'feature/payment-v2',
        commitHash: '8f3a921',
        analyzedAt: 'Just now',
        overallRiskScore: 18,
        riskLevel: 'LOW',
        status: 'approved',
        categoryScores: {
          security: 94,
          reliability: 91,
          testing: 86,
          dependencies: 95,
          changeRisk: 67
        },
        testCoveragePercent: 86,
        issues: FIXED_ISSUES,
        summary: 'ShipSafe verified that all release-blocking issues have been resolved by IBM Bob. Regression tests passed.'
      };
    }

    return {
      id: releaseId,
      releaseNumber: '#184',
      repositoryId: 'payment-service',
      repositoryName: 'payment-service',
      branch: 'feature/payment-v2',
      commitHash: '8f3a921',
      analyzedAt: '2 minutes ago',
      overallRiskScore: 72,
      riskLevel: 'HIGH',
      status: 'blocked',
      categoryScores: {
        security: 82,
        reliability: 61,
        testing: 48,
        dependencies: 79,
        changeRisk: 67
      },
      testCoveragePercent: 68,
      issues: INITIAL_ISSUES,
      summary: 'ShipSafe detected release-blocking issues (2 Critical, 3 High) that should be resolved before deployment.'
    };
  }

  async analyzePullRequest(prId: string): Promise<ReleaseAnalysis> {
    return this.analyzeRelease('184', 'payment-service');
  }

  async runFailureSimulation(scenarioId: string): Promise<FailureScenario> {
    return SCENARIOS[scenarioId] || SCENARIOS['http-500'];
  }
}
