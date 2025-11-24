import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Authentication interceptor that adds Bearer token to HTTP requests.
 * 
 * This functional interceptor:
 * - Retrieves the authentication token from AuthService
 * - Adds Authorization header with Bearer token to requests
 * - Skips token injection for public endpoints (login, register)
 * 
 * Requirements: 3.2
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // List of public endpoints that don't require authentication
  const publicEndpoints = ['/login', '/register', '/api/auth/login', '/api/auth/register'];
  
  // Check if the request URL matches any public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    req.url.includes(endpoint)
  );
  
  // Skip adding token for public endpoints
  if (isPublicEndpoint) {
    return next(req);
  }
  
  // Get the authentication token
  const token = authService.getToken();
  
  // If no token exists, proceed without modification
  if (!token) {
    return next(req);
  }
  
  // Clone the request and add the Authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return next(authReq);
};
