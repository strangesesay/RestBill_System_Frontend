import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, timer, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Retry interceptor that automatically retries failed HTTP requests.
 * 
 * This functional interceptor:
 * - Retries requests that fail with network errors
 * - Retries requests that fail with 5xx server errors
 * - Skips retry for 4xx client errors
 * - Implements exponential backoff (1s, 2s, 4s)
 * - Maximum 3 retry attempts
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const maxRetries = environment.retryAttempts || 3;
  const baseDelay = environment.retryDelay || 1000;
  
  return next(req).pipe(
    retry({
      count: maxRetries,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Determine if we should retry based on error type
        const shouldRetry = shouldRetryRequest(error);
        
        if (!shouldRetry) {
          // Don't retry - throw the error immediately
          return throwError(() => error);
        }
        
        // Calculate exponential backoff delay: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, retryCount - 1);
        
        console.log(`Retrying request (attempt ${retryCount}/${maxRetries}) after ${delay}ms...`);
        
        // Return a timer that will trigger the retry after the delay
        return timer(delay);
      }
    })
  );
};

/**
 * Determines if a request should be retried based on the error type.
 * 
 * Retry conditions:
 * - Network errors (status 0 or error.error instanceof ErrorEvent)
 * - Server errors (5xx status codes)
 * 
 * Do not retry:
 * - Client errors (4xx status codes)
 * 
 * @param error The HTTP error response
 * @returns true if the request should be retried, false otherwise
 */
function shouldRetryRequest(error: HttpErrorResponse): boolean {
  // Network errors (no response from server)
  if (error.error instanceof ErrorEvent || error.status === 0) {
    return true;
  }
  
  // Server errors (5xx) - these might be transient
  if (error.status >= 500 && error.status < 600) {
    return true;
  }
  
  // Client errors (4xx) - these are not transient, don't retry
  if (error.status >= 400 && error.status < 500) {
    return false;
  }
  
  // For any other errors, don't retry
  return false;
}
