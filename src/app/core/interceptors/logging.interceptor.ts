import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Logging interceptor that logs HTTP requests and responses in development mode.
 * 
 * This functional interceptor:
 * - Logs request details (method, URL, headers) in development mode
 * - Logs response details (status, body) in development mode
 * - Logs error details in development mode
 * - Sanitizes sensitive data (passwords, tokens) from logs
 * - Disabled in production mode
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip logging in production mode
  if (environment.production || !environment.enableLogging) {
    return next(req);
  }
  
  const startTime = Date.now();
  
  // Log the outgoing request
  console.group(`🌐 HTTP ${req.method} ${req.url}`);
  console.log('Request:', {
    method: req.method,
    url: req.url,
    headers: sanitizeHeaders(req.headers),
    body: sanitizeBody(req.body)
  });
  
  return next(req).pipe(
    tap({
      next: (event) => {
        // Log successful responses
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          console.log(`✅ Response (${duration}ms):`, {
            status: event.status,
            statusText: event.statusText,
            headers: sanitizeHeaders(event.headers),
            body: truncateBody(event.body)
          });
          console.groupEnd();
        }
      },
      error: (error) => {
        // Log error responses
        const duration = Date.now() - startTime;
        console.error(`❌ Error (${duration}ms):`, {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        console.groupEnd();
      }
    })
  );
};

/**
 * Sanitizes HTTP headers by removing or masking sensitive information.
 * Removes Authorization headers and masks other sensitive headers.
 * 
 * @param headers HttpHeaders object to sanitize
 * @returns Sanitized headers object
 */
function sanitizeHeaders(headers: any): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  headers.keys().forEach((key: string) => {
    const lowerKey = key.toLowerCase();
    
    // Remove sensitive headers completely
    if (lowerKey === 'authorization') {
      sanitized[key] = '[REDACTED]';
    } else if (lowerKey === 'cookie' || lowerKey === 'set-cookie') {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = headers.get(key);
    }
  });
  
  return sanitized;
}

/**
 * Sanitizes request/response body by removing or masking sensitive fields.
 * Removes password, token, and other sensitive fields from logs.
 * 
 * @param body Request or response body
 * @returns Sanitized body
 */
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  // Create a shallow copy to avoid modifying the original
  const sanitized = { ...body };
  
  // List of sensitive field names to sanitize
  const sensitiveFields = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'authorization',
    'creditCard',
    'ssn',
    'pin'
  ];
  
  // Mask sensitive fields
  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
    
    // Also check camelCase and snake_case variations
    const camelCase = field.charAt(0).toLowerCase() + field.slice(1);
    const snakeCase = field.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    if (camelCase in sanitized) {
      sanitized[camelCase] = '[REDACTED]';
    }
    if (snakeCase in sanitized) {
      sanitized[snakeCase] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

/**
 * Truncates large response bodies to prevent console overflow.
 * Limits body size to 1000 characters for readability.
 * 
 * @param body Response body
 * @returns Truncated body
 */
function truncateBody(body: any): any {
  if (!body) {
    return body;
  }
  
  const bodyString = JSON.stringify(body);
  const maxLength = 1000;
  
  if (bodyString.length > maxLength) {
    return bodyString.substring(0, maxLength) + '... [truncated]';
  }
  
  return body;
}
