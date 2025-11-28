import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { LoginRequest, UserRole } from '../../models/auth.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
``

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

    //Injecting Authservice and Router dependencies
  private authService = inject(AuthService);
  private router = inject(Router);



   username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;


  onSubmit(): void {
      if (!this.username || !this.password) {
        this.errorMessage = 'Please enter both username and password';
        return;
      }
  
      this.isLoading = true;
      this.errorMessage = '';
  
      const credentials: LoginRequest = {
        username: this.username,
        password: this.password
      };
  
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          // Navigate based on role
          if (response.role === UserRole.OWNER) {
            this.router.navigate(['/owner-dashboard']);
          } else if (response.role === UserRole.CASHIER) {
            this.router.navigate(['/cashier-dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Invalid username or password';
        }
      });
    }

}
