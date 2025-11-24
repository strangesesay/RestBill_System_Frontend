import { Injectable } from '@angular/core';

/**
 * Service for managing authentication tokens and authentication state.
 * Uses localStorage for token persistence across browser sessions.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';

  /**
   * Retrieves the authentication token from localStorage.
   * @returns The stored token or null if no token exists
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Stores the authentication token in localStorage.
   * @param token The JWT token to store
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Removes the authentication token from localStorage.
   */
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Checks if the user is authenticated by verifying token existence.
   * @returns true if a token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
