/**
 * Sample FIXED File for ShipSafe AI (Post-IBM Bob Remediation)
 * File: customTestService.fixed.ts
 */

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export class UserGatewayError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserGatewayError";
  }
}

export class UserGateway {
  async fetchUserData(userId: string): Promise<any> {
    if (Math.random() > 0.5) {
      throw new Error("HTTP 503 Service Unavailable: Remote user directory unreachable");
    }
    return { id: userId, name: "Alice", email: "alice@example.com", balance: 500 };
  }
}

const gateway = new UserGateway();

/**
 * ✅ FIXED #1: Exception Boundary & Fallback Error Handling
 */
export async function getUserProfile(userId: string): Promise<UserAccount> {
  try {
    const data = await gateway.fetchUserData(userId);
    if (!data || !data.id) {
      throw new UserGatewayError("Remote directory returned an invalid payload");
    }
    return data;
  } catch (error: any) {
    console.error(`[UserGateway Error] Failed for ${userId}:`, error.message);
    throw new UserGatewayError(`Unable to fetch user profile: ${error.message}`);
  }
}

/**
 * ✅ FIXED #2: Parameterized SQL Query
 */
export async function searchUsersByName(nameInput: string, dbClient: any): Promise<any[]> {
  const safeQuery = `SELECT * FROM users WHERE name LIKE $1 AND is_active = $2`;
  const result = await dbClient.query(safeQuery, [`%${nameInput}%`, true]);
  return result.rows;
}

/**
 * ✅ FIXED #3: Environment Secret Injection & Auth Check
 */
export async function transferBalance(senderId: string, receiverId: string, amount: number, userContext: any) {
  const apiSecret = process.env.API_SECRET;
  if (!apiSecret) {
    throw new Error("FATAL: Missing API_SECRET environment variable");
  }
  if (!userContext || userContext.id !== senderId) {
    throw new Error("UNAUTHORIZED: Caller does not own the sender account");
  }
  return { success: true, transferred: amount };
}
