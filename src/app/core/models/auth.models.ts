/**
 * Authentication Models
 * 
 * This file contains interfaces for authentication and user management
 * used throughout the application.
 */

/**
 * Login request payload
 * Sent to backend for user authentication
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login response from backend
 * Contains authentication token and user information
 */
export interface LoginResponse {
  token: string;
  type: string;
  username: string;
  role: string;
}

/**
 * User roles in the RestBill system
 * Defines different access levels and permissions
 */
export enum UserRole {
  OWNER = 'OWNER',
  CASHIER = 'CASHIER'
}

/**
 * Register cashier request payload
 */
export interface RegisterRequest {
  username: string;
  password: string;
}

/**
 * User entity
 * Represents a user in the system
 */
export interface User {
  id: number;
  username: string;
  role: UserRole;
}
