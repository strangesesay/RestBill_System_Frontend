import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { LoginRequest, LoginResponse, User } from '../models/auth.models';

/**
 * User API Service
 * 
 * Handles all HTTP communication related to user authentication and management.
 * Extends BaseApiService to inherit common HTTP methods.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
@Injectable({ providedIn: 'root' })
export class UserApiService extends BaseApiService {
  protected readonly endpoint = '/api/users';
  
  /**
   * Authenticates a user with username and password
   * 
   * @param credentials - User login credentials
   * @returns Observable of LoginResponse containing token and user info
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginResponse>('/login', credentials);
  }
  
  /**
   * Retrieves the currently authenticated user's information
   * 
   * @returns Observable of User object
   */
  getCurrentUser(): Observable<User> {
    return this.get<User>('/me');
  }
}
