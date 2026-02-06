/**
 * JWT payload structure with standard claims.
 */
export interface JwtPayload {
  sub: string;        // username/subject
  iat: number;        // issued at (seconds)
  exp: number;        // expiration (seconds)
  [key: string]: unknown; // other claims
}

/**
 * Utility functions for JWT token handling.
 *
 * WARNING: These functions perform client-side decoding only.
 * They do NOT verify the JWT signature. Backend verification
 * is the source of truth for token validity.
 */
export class JwtUtil {
  /**
   * Decode JWT token (client-side, no signature verification).
   *
   * @param token - The JWT token string
   * @returns Decoded payload or null if invalid format
   */
  static decode(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      // Base64 URL decoding
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired based on exp claim.
   *
   * @param token - The JWT token string
   * @returns true if token is expired or invalid
   */
  static isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload || !payload.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    return Date.now() >= payload.exp * 1000;
  }

  /**
   * Get expiration time in milliseconds.
   *
   * @param token - The JWT token string
   * @returns Expiration timestamp in milliseconds or null if invalid
   */
  static getExpirationTime(token: string): number | null {
    const payload = this.decode(token);
    return payload?.exp ? payload.exp * 1000 : null;
  }

  /**
   * Get username (subject) from token.
   *
   * @param token - The JWT token string
   * @returns Username or null if invalid
   */
  static getUsername(token: string): string | null {
    const payload = this.decode(token);
    return payload?.sub || null;
  }
}
