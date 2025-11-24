import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AppError } from '../models/api.models';

/**
 * Service for managing and displaying application errors.
 * Transforms HTTP errors into user-friendly messages and emits them
 * for display in the UI.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new Subject<AppError>();
  
  /**
   * Observable stream of application errors.
   * Components can subscribe to this to display error messages.
   */
  readonly error$ = this.errorSubject.asObservable();

  /**
   * Handles HTTP errors by transforming them into AppError format
   * and emitting them through the error$ observable.
   * 
   * @param error The HTTP error response to handle
   */
  handleError(error: HttpErrorResponse): void {
    const appError = this.transformError(error);
    
    // Log detailed error information for debugging
    console.error('Error occurred:', {
      message: appError.message,
      statusCode: appError.statusCode,
      details: appError.details,
      originalError: error
    });
    
    this.errorSubject.next(appError);
  }

  /**
   * Clears the current error state.
   */
  clearError(): void {
    // Could emit a null or special value if needed for clearing UI
  }

  /**
   * Transforms an HttpErrorResponse into a user-friendly AppError.
   * Maps status codes to appropriate user messages.
   * 
   * @param error The HTTP error response
   * @returns Transformed AppError with user-friendly message
   */
  private transformError(error: HttpErrorResponse): AppError {
    // Handle network errors (no response from server)
    if (error.error instanceof ErrorEvent) {
      return {
        message: 'Network connection failed. Please check your internet connection.',
        statusCode: 0,
        details: error.error.message
      };
    }

    // Handle HTTP error responses
    const message = this.getErrorMessage(error.status, error.error);
    return {
      message,
      statusCode: error.status,
      details: error.error?.message || error.message
    };
  }

  /**
   * Maps HTTP status codes to user-friendly error messages.
   * 
   * @param status HTTP status code
   * @param errorBody Error response body from backend
   * @returns User-friendly error message
   */
  private getErrorMessage(status: number, errorBody: any): string {
    // Try to use backend error message if available
    if (errorBody?.message) {
      return errorBody.message;
    }

    // Map status codes to default messages
    switch (status) {
      case 400:
        return 'Invalid request data. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please log in to continue.';
      case 403:
        return 'Insufficient permissions. You do not have access to this resource.';
      case 404:
        return 'Resource not found. The requested item does not exist.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Backend service unavailable. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      case 504:
        return 'Request timeout. The server took too long to respond.';
      default:
        return `An error occurred (${status}). Please try again.`;
    }
  }
}
