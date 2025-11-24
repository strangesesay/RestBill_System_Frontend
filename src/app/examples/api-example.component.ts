import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../core/services/user-api.service';
import { LoadingService } from '../core/services/loading.service';
import { ErrorService } from '../core/services/error.service';
import { AuthService } from '../core/services/auth.service';
import { User, LoginRequest } from '../core/models/auth.models';

/**
 * Example Component demonstrating API usage
 * 
 * This component shows how to:
 * - Call API services (UserApiService)
 * - Handle loading states (LoadingService)
 * - Handle errors (ErrorService)
 * - Work with authentication (AuthService)
 * 
 * Requirements: All
 */
@Component({
  selector: 'app-api-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <h1 class="mb-4">API Integration Example</h1>
      
      <!-- Loading State Display -->
      <div class="alert alert-info mb-4" *ngIf="loadingService.isLoading()">
        <i class="bi bi-hourglass-split"></i> Loading...
      </div>

      <!-- Login Section -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>Login Example</h3>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onLogin()" #loginForm="ngForm">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input 
                type="text" 
                class="form-control" 
                id="username" 
                name="username"
                [(ngModel)]="loginCredentials.username"
                required
                placeholder="Enter username">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="password"
                name="password"
                [(ngModel)]="loginCredentials.password"
                required
                placeholder="Enter password">
            </div>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="!loginForm.valid || loadingService.isLoading()">
              Login
            </button>
            <button 
              type="button" 
              class="btn btn-secondary ms-2"
              (click)="onLogout()"
              [disabled]="!authService.isAuthenticated()">
              Logout
            </button>
          </form>
          
          <!-- Login Result -->
          <div class="mt-3" *ngIf="loginResult()">
            <div class="alert alert-success">
              <strong>Login Successful!</strong>
              <p class="mb-0">Token: {{ loginResult()?.token?.substring(0, 20) }}...</p>
              <p class="mb-0">User: {{ loginResult()?.user?.username }}</p>
              <p class="mb-0">Role: {{ loginResult()?.user?.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Get Current User Section -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>Get Current User Example</h3>
        </div>
        <div class="card-body">
          <button 
            type="button" 
            class="btn btn-primary"
            (click)="onGetCurrentUser()"
            [disabled]="!authService.isAuthenticated() || loadingService.isLoading()">
            Get Current User
          </button>
          
          <!-- Current User Result -->
          <div class="mt-3" *ngIf="currentUser()">
            <div class="alert alert-info">
              <strong>Current User:</strong>
              <p class="mb-0">ID: {{ currentUser()?.id }}</p>
              <p class="mb-0">Username: {{ currentUser()?.username }}</p>
              <p class="mb-0">Email: {{ currentUser()?.email }}</p>
              <p class="mb-0">Role: {{ currentUser()?.role }}</p>
              <p class="mb-0">Created: {{ currentUser()?.createdAt }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Trigger Section -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>Error Handling Example</h3>
        </div>
        <div class="card-body">
          <p>These buttons demonstrate error handling for different scenarios:</p>
          <div class="btn-group" role="group">
            <button 
              type="button" 
              class="btn btn-outline-danger"
              (click)="triggerError(401)"
              [disabled]="loadingService.isLoading()">
              401 Unauthorized
            </button>
            <button 
              type="button" 
              class="btn btn-outline-danger"
              (click)="triggerError(404)"
              [disabled]="loadingService.isLoading()">
              404 Not Found
            </button>
            <button 
              type="button" 
              class="btn btn-outline-danger"
              (click)="triggerError(500)"
              [disabled]="loadingService.isLoading()">
              500 Server Error
            </button>
          </div>
          <p class="mt-3 text-muted">
            <small>Note: These will trigger actual API calls that will fail. 
            Errors are displayed via SweetAlert2 popup and logged to console.</small>
          </p>
        </div>
      </div>

      <!-- Authentication Status -->
      <div class="card">
        <div class="card-header">
          <h3>Authentication Status</h3>
        </div>
        <div class="card-body">
          <p>
            <strong>Authenticated:</strong> 
            <span [class]="authService.isAuthenticated() ? 'text-success' : 'text-danger'">
              {{ authService.isAuthenticated() ? 'Yes' : 'No' }}
            </span>
          </p>
          <p>
            <strong>Token:</strong> 
            <code>{{ authService.getToken() || 'No token' }}</code>
          </p>
        </div>
      </div>

      <!-- Instructions -->
      <div class="alert alert-warning mt-4">
        <h4>Instructions:</h4>
        <ol>
          <li>Make sure the backend server is running on http://localhost:8080</li>
          <li>Try logging in with valid credentials</li>
          <li>After login, try getting the current user</li>
          <li>Test error handling by clicking the error buttons</li>
          <li>Watch the loading indicator appear during API calls</li>
          <li>Check the browser console for detailed logs (in development mode)</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
    }
    
    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card-header {
      background-color: #f8f9fa;
      font-weight: 500;
    }
    
    code {
      background-color: #f8f9fa;
      padding: 2px 6px;
      border-radius: 3px;
      word-break: break-all;
    }
  `]
})
export class ApiExampleComponent {
  // Login form data
  loginCredentials: LoginRequest = {
    username: '',
    password: ''
  };

  // Signals for reactive state
  loginResult = signal<any>(null);
  currentUser = signal<User | null>(null);

  constructor(
    private userApiService: UserApiService,
    public loadingService: LoadingService,
    private errorService: ErrorService,
    public authService: AuthService
  ) {}

  /**
   * Handles login form submission
   * Demonstrates:
   * - Calling API service method
   * - Handling successful response
   * - Storing authentication token
   * - Error handling (automatic via interceptors)
   */
  onLogin(): void {
    this.loginResult.set(null);
    this.currentUser.set(null);

    this.userApiService.login(this.loginCredentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loginResult.set(response);
        
        // Store the token using AuthService
        this.authService.setToken(response.token);
      },
      error: (error) => {
        // Error is already handled by error interceptor
        // This is just for additional component-specific logic if needed
        console.error('Login failed in component:', error);
      }
    });
  }

  /**
   * Handles logout
   * Clears authentication token and resets state
   */
  onLogout(): void {
    this.authService.clearToken();
    this.loginResult.set(null);
    this.currentUser.set(null);
    console.log('Logged out successfully');
  }

  /**
   * Gets the current authenticated user
   * Demonstrates:
   * - Calling authenticated API endpoint
   * - Auth interceptor automatically adds token
   * - Handling user data response
   */
  onGetCurrentUser(): void {
    this.currentUser.set(null);

    this.userApiService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('Current user retrieved:', user);
        this.currentUser.set(user);
      },
      error: (error) => {
        // Error is already handled by error interceptor
        console.error('Get current user failed in component:', error);
      }
    });
  }

  /**
   * Triggers an error for demonstration purposes
   * Makes a request to a non-existent endpoint to simulate errors
   * 
   * @param statusCode The HTTP status code to simulate
   */
  triggerError(statusCode: number): void {
    // Make a request to a non-existent endpoint to trigger an error
    // The actual status code will depend on backend configuration
    const errorEndpoint = `/api/trigger-error-${statusCode}`;
    
    this.userApiService['get'](errorEndpoint).subscribe({
      next: () => {
        console.log('Unexpected success');
      },
      error: (error) => {
        console.log(`Triggered ${statusCode} error for demonstration`);
      }
    });
  }
}
