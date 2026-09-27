import { IBobService } from './types';
import { BobAction } from '@/types';

export const BEFORE_CODE_PAYMENT_SERVICE = `/**
 * Line 112: Process Payment
 * UNHANDLED PAYMENT PROVIDER FAILURE
 */
export async function processPayment(order: PaymentOrder): Promise<string> {
  const response = await paymentProvider.charge(order);

  return response.transactionId;
}`;

export const AFTER_CODE_PAYMENT_SERVICE = `export class PaymentProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentProviderError";
  }
}

/**
 * Line 112: Process Payment (REMEDIATED BY IBM BOB)
 * Includes try/catch exception wrapping, typed error throwing,
 * and null/undefined transactionId guards.
 */
export async function processPayment(order: PaymentOrder): Promise<string> {
  try {
    const response = await paymentProvider.charge(order);

    if (!response || !response.transactionId) {
      throw new PaymentProviderError(
        "Payment provider returned an invalid or missing transaction response"
      );
    }

    return response.transactionId;
  } catch (error: any) {
    console.error(\`[PaymentService Error] Charge failed for order \${order.id}:\`, error.message);
    throw new PaymentProviderError(
      \`Payment provider charge failed: \${error.message}\`
    );
  }
}`;

export const GENERATED_TESTS_CODE = `import { processPayment, PaymentProviderError } from '../src/payments/paymentService';

describe('IBM Bob Generated Regression Tests - Payment Service', () => {
  it('✓ handles provider timeout gracefully', async () => {
    const highAmountOrder = { id: 'ord_999', amount: 10000, currency: 'USD', customerId: 'cust_01' };
    await expect(processPayment(highAmountOrder)).rejects.toThrow(PaymentProviderError);
  });

  it('✓ handles HTTP 500 error without leaking unhandled exceptions', async () => {
    const order = { id: 'ord_500', amount: 6000, currency: 'USD', customerId: 'cust_02' };
    await expect(processPayment(order)).rejects.toThrow('Payment provider charge failed');
  });

  it('✓ handles malformed gateway response', async () => {
    expect(true).toBe(true);
  });

  it('✓ handles missing transaction ID', async () => {
    expect(true).toBe(true);
  });

  it('✓ preserves successful payment behavior for valid charges', async () => {
    const normalOrder = { id: 'ord_100', amount: 50, currency: 'USD', customerId: 'cust_03' };
    const tx = await processPayment(normalOrder);
    expect(tx).toBeDefined();
  });

  it('✓ prevents inconsistent order state on failure', async () => {
    expect(true).toBe(true);
  });
});`;

export class MockBobService implements IBobService {
  async fixIssue(issueId: string, repositoryId: string, currentCode?: string): Promise<{
    action: BobAction;
    fixedCode: string;
    generatedTests: string;
  }> {
    const action: BobAction = {
      id: 'bob-act-291',
      issueId,
      repositoryId,
      task: 'Fix unhandled payment provider failure & generate regression tests',
      status: 'completed',
      modifiedFilesCount: 3,
      testsAddedCount: 6,
      durationSeconds: 42,
      timestamp: 'Just now',
      beforeCode: BEFORE_CODE_PAYMENT_SERVICE,
      afterCode: AFTER_CODE_PAYMENT_SERVICE,
      generatedTestsCode: GENERATED_TESTS_CODE,
      executionLogs: [
        'Analyzed payment-service repository AST',
        'Located affected target at src/payments/paymentService.ts:112',
        'Added PaymentProviderError custom exception type',
        'Wrapped charge() call in try/catch block with fallback handling',
        'Generated 6 regression unit tests in tests/payment.test.ts',
        'Executed Jest test suite: 6 passing, 0 failing',
        'Validated code diff safety'
      ]
    };

    return {
      action,
      fixedCode: AFTER_CODE_PAYMENT_SERVICE,
      generatedTests: GENERATED_TESTS_CODE
    };
  }
}
