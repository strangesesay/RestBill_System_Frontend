import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';

/**
 * Error interceptor that catches and transforms HTTP errors.
 * 
 * This functional interceptor:
 * - Catches HTTP errors from requests
 * - Transforms errors into user-friendly AppError format
 * - Emits errors through ErrorService for display
 * - Re-throws the error for downstream handling
 * 
 * Requirements: 3.4, 5.1-5.7
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle the error through ErrorService
      errorService.handleError(error);
      
      // Re-throw the error so downstream handlers can also process it
      return throwError(() => error);
    })
  );
};
