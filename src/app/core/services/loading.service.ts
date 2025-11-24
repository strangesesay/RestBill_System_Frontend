import { Injectable, signal, computed } from '@angular/core';

/**
 * Service for managing global loading state across the application.
 * Uses Angular signals to track the number of active HTTP requests.
 * The loading indicator is shown when one or more requests are in progress.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /**
   * Signal tracking the number of active HTTP requests.
   * Incremented when a request starts, decremented when it completes.
   */
  private loadingCount = signal(0);

  /**
   * Computed signal that returns true if any requests are in progress.
   * This can be used directly in templates or subscribed to in components.
   */
  readonly isLoading = computed(() => this.loadingCount() > 0);

  /**
   * Increments the loading counter to indicate a new request has started.
   * Should be called when an HTTP request begins.
   */
  show(): void {
    this.loadingCount.update(count => count + 1);
  }

  /**
   * Decrements the loading counter to indicate a request has completed.
   * Should be called when an HTTP request finishes (success or error).
   */
  hide(): void {
    this.loadingCount.update(count => Math.max(0, count - 1));
  }
}
