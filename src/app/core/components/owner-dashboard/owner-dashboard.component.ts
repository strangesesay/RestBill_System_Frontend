import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.models';

@Component({
  selector: 'app-owner-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css'
})
export class OwnerDashboardComponent {
  private authService = inject(AuthService);

  cashierUsername: string = '';
  cashierPassword: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  get currentUsername(): string | null {
    return this.authService.getUsername();
  }

  onRegisterCashier(): void {
    if (!this.cashierUsername || !this.cashierPassword) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: RegisterRequest = {
      username: this.cashierUsername,
      password: this.cashierPassword
    };

    this.authService.registerCashier(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Cashier "${this.cashierUsername}" registered successfully!`;
        this.cashierUsername = '';
        this.cashierPassword = '';
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to register cashier';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
