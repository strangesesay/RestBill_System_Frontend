/**
 * API Response and Error Models
 * 
 * This file contains interfaces for API communication, error handling,
 * and HTTP configuration used throughout the application.
 */

/**
 * Generic API response wrapper
 * Used to wrap all successful API responses with consistent structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

/**
 * API error response from backend
 * Represents structured error responses from the Spring Boot backend
 */
export interface ApiError {
  status: number;
  message: string;
  errors?: ValidationError[];
  timestamp: string;
  path: string;
}

/**
 * Application-level error
 * Used internally for error handling and display
 */
export interface AppError {
  message: string;
  statusCode?: number;
  details?: string;
}

/**
 * Validation error for form fields
 * Represents field-level validation errors from backend
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * HTTP client configuration
 * Defines configuration for HTTP requests
 */
export interface HttpConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * Interceptor context
 * Used to pass configuration to HTTP interceptors
 */
export interface InterceptorContext {
  skipAuth?: boolean;
  skipLoading?: boolean;
  skipRetry?: boolean;
  customTimeout?: number;
}
