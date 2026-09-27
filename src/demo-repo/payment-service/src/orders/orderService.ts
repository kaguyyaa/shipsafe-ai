export interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export class OrderRepository {
  private db: any;

  constructor(dbClient: any) {
    this.db = dbClient;
  }

  /**
   * Line 84: Get Order By ID
   * CRITICAL SECURITY ISSUE DETECTED BY SHIPSAFE:
   * SQL Injection vulnerability. User-controlled orderId is directly interpolated into raw SQL.
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    // Line 84
    const query = `SELECT * FROM orders WHERE id = '${orderId}' AND is_active = true`;
    
    // Executing raw query without parameterized bindings
    const result = await this.db.query(query);
    return result.rows[0] || null;
  }
}
