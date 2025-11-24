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
  user: User;
  expiresIn: number;
}

/**
 * User entity
 * Represents an authenticated user in the system
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

/**
 * User roles in the RestBill system
 * Defines different access levels and permissions
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  WAITER = 'WAITER',
  KITCHEN = 'KITCHEN',
  CASHIER = 'CASHIER'
}
