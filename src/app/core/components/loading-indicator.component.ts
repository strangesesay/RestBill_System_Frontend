import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../services/loading.service';

/**
 * Loading indicator component that displays a spinner overlay when HTTP requests are in progress.
 * Subscribes to LoadingService.isLoading signal to show/hide the loading state.
 * Uses Bootstrap spinner classes for styling.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */
@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="loading-text mt-3">Loading...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
    }

    .loading-text {
      color: #333;
      font-size: 1rem;
      margin: 0;
    }
  `]
})
export class LoadingIndicatorComponent {
  /**
   * Inject LoadingService to access the isLoading signal.
   * The signal is accessed directly in the template using loadingService.isLoading()
   */
  protected readonly loadingService = inject(LoadingService);
}
