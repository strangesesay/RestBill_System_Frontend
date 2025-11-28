import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, UserRole } from '../models/auth.models';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * Service for managing authentication tokens and authentication state.
 * Uses localStorage for token persistence across browser sessions.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly usernameKey = 'username';
  private readonly roleKey = 'user_role';
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;
  
  private http = inject(HttpClient);
  private router = inject(Router);

  /**
   * Authenticates user with backend
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUsername(response.username);
        this.setRole(response.role);
      })
    );
  }

  /**
   * Registers a new cashier (only accessible by OWNER)
   */
  registerCashier(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/cashier`, request);
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    this.clearToken();
    this.clearUsername();
    this.clearRole();
    this.router.navigate(['/login']);
  }

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
   * Gets the current username
   */
  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  /**
   * Stores the username
   */
  setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  /**
   * Removes the username
   */
  clearUsername(): void {
    localStorage.removeItem(this.usernameKey);
  }

  /**
   * Gets the current user role
   */
  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  /**
   * Stores the user role
   */
  setRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  /**
   * Removes the user role
   */
  clearRole(): void {
    localStorage.removeItem(this.roleKey);
  }

  /**
   * Checks if the user is authenticated by verifying token existence.
   * @returns true if a token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Checks if the current user is an owner
   */
  isOwner(): boolean {
    return this.getRole() === UserRole.OWNER;
  }

  /**
   * Checks if the current user is a cashier
   */
  isCashier(): boolean {
    return this.getRole() === UserRole.CASHIER;
  }
}
