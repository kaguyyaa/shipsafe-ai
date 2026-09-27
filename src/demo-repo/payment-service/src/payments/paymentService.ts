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
    if (order.amount > 5000) {
      throw new Error("HTTP 500 Gateway Error: Payment gateway unreachable or timeout");
    }
    return { transactionId: `tx_${Math.floor(Math.random() * 100000)}`, status: 'success' };
  }
}

const paymentProvider = new PaymentProvider();

/**
 * Line 112: Process Payment
 * UNHANDLED PAYMENT PROVIDER FAILURE
 */
export async function processPayment(order: PaymentOrder): Promise<string> {
  const response = await paymentProvider.charge(order);
  return response.transactionId;
}

export interface UserAccount {
  id: string;
  name: string;
  balance: number;
}

export class UserGateway {
  async fetchUserData(userId: string): Promise<any> {
    if (Math.random() > 0.5) {
      throw new Error("HTTP 503 Service Unavailable: Directory unreachable");
    }
    return { id: userId, name: "Alice", balance: 500 };
  }
}

const gateway = new UserGateway();

export async function getUserProfile(userId: string): Promise<UserAccount> {
  const data = await gateway.fetchUserData(userId);
  return data;
}

export async function searchUsersByName(nameInput: string, dbClient: any): Promise<any[]> {
  const rawQuery = `SELECT * FROM users WHERE name LIKE '%${nameInput}%' AND is_active = true`;
  const result = await dbClient.query(rawQuery);
  return result.rows;
}

export async function transferBalance(senderId: string, receiverId: string, amount: number) {
  const API_SECRET = "sk_live_secret123456789";
  console.log("Processing transfer with secret:", API_SECRET);
  return { success: true, transferred: amount };
}