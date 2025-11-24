import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ErrorService } from '../services/error.service';

/**
 * Error Display Component
 * 
 * Subscribes to the ErrorService and displays errors using SweetAlert2.
 * This component should be included in the app root to handle all application errors.
 * 
 * Requirements: 5.1-5.7
 */
@Component({
  selector: 'app-error-display',
  standalone: true,
  template: '', // No template needed - errors are displayed via SweetAlert2
  styles: []
})
export class ErrorDisplayComponent implements OnInit, OnDestroy {
  private errorSubscription?: Subscription;

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    // Subscribe to error$ observable and display errors using SweetAlert2
    this.errorSubscription = this.errorService.error$.subscribe(error => {
      this.displayError(error);
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  /**
   * Displays an error using SweetAlert2.
   * Shows error message, status code, and details.
   * 
   * @param error The application error to display
   */
  private displayError(error: { message: string; statusCode?: number; details?: string }): void {
    // Build the title with status code if available
    const title = error.statusCode 
      ? `Error ${error.statusCode}` 
      : 'Error';

    // Build the footer with details if available
    const footer = error.details 
      ? `<small style="color: #666;">${this.escapeHtml(error.details)}</small>` 
      : undefined;

    // Display the error using SweetAlert2
    Swal.fire({
      icon: 'error',
      title: title,
      text: error.message,
      footer: footer,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33'
    });
  }

  /**
   * Escapes HTML to prevent XSS attacks in error details.
   * 
   * @param text The text to escape
   * @returns Escaped HTML string
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
