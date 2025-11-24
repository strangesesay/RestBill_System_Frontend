import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * Loading interceptor that manages global loading state during HTTP requests.
 * 
 * This functional interceptor:
 * - Increments loading counter when a request starts
 * - Decrements loading counter when a request completes (success or error)
 * - Maintains loading state for multiple concurrent requests
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Increment loading counter when request starts
  loadingService.show();
  
  // Proceed with the request and ensure loading counter is decremented
  // when the request completes (either successfully or with error)
  return next(req).pipe(
    finalize(() => {
      // Decrement loading counter when request completes
      loadingService.hide();
    })
  );
};
