export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  customerId: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'failed';
}

export class PaymentProvider {
  async charge(order: PaymentOrder): Promise<PaymentResponse> {
    // External HTTP call simulation to payment gateway
    if (order.amount > 5000) {
      throw new Error("HTTP 500 Gateway Error: Payment gateway unreachable or timeout");
    }
    return { transactionId: `tx_${Math.floor(Math.random() * 100000)}`, status: 'success' };
  }
}

const paymentProvider = new PaymentProvider();

/**
 * Line 112: Process Payment
 * BUG DETECTED BY SHIPSAFE:
 * Unhandled payment provider error. A provider timeout or 500 error causes
 * an unhandled exception and leaves the order in an inconsistent state.
 */
export async function processPayment(order: PaymentOrder): Promise<string> {
  // Line 112
  const response = await paymentProvider.charge(order);

  return response.transactionId;
}
