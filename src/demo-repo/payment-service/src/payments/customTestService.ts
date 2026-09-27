/**
 * Sample Test File for ShipSafe AI
 * File: customTestService.ts
 */

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export class UserGateway {
  async fetchUserData(userId: string): Promise<any> {
    // Simulates an unstable remote external API call
    if (Math.random() > 0.5) {
      throw new Error("HTTP 503 Service Unavailable: Remote user directory unreachable");
    }
    return { id: userId, name: "Alice", email: "alice@example.com", balance: 500 };
  }
}

const gateway = new UserGateway();

/**
 * ⚠️ FLAW #1: Unhandled Remote API Exception
 * If fetchUserData fails or times out, this uncaught promise rejection crashes the node process.
 */
export async function getUserProfile(userId: string): Promise<UserAccount> {
  const data = await gateway.fetchUserData(userId);
  return data;
}

/**
 * ⚠️ FLAW #2: SQL Injection Vulnerability
 * Raw input concatenation inside SQL query string allowing SQL injection attacks.
 */
export async function searchUsersByName(nameInput: string, dbClient: any): Promise<any[]> {
  const rawQuery = `SELECT * FROM users WHERE name LIKE '%${nameInput}%' AND is_active = true`;
  const result = await dbClient.query(rawQuery);
  return result.rows;
}

/**
 * ⚠️ FLAW #3: Hardcoded Secret & Missing Authorization
 */
export async function transferBalance(senderId: string, receiverId: string, amount: number) {
  const API_SECRET = "sk_live_secret123456789"; // Hardcoded secret fallback
  console.log("Processing transfer with secret:", API_SECRET);
  // Missing caller authorization check
  return { success: true, transferred: amount };
}
