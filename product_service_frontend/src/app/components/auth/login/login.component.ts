import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">
              <i class="fas fa-sign-in-alt me-2"></i>Login
            </h2>
            
            <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="username"
                  name="username"
                  [(ngModel)]="loginData.username"
                  required
                  #username="ngModel">
                <div class="invalid-feedback" *ngIf="username.invalid && username.touched">
                  Username is required.
                </div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password"
                  name="password"
                  [(ngModel)]="loginData.password"
                  required
                  #password="ngModel">
                <div class="invalid-feedback" *ngIf="password.invalid && password.touched">
                  Password is required.
                </div>
              </div>
              
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="loading || loginForm.invalid">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  <i class="fas fa-sign-in-alt me-2" *ngIf="!loading"></i>
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </div>
            </form>
            
            <div class="text-center mt-3">
              <p class="mb-0">Don't have an account? 
                <a routerLink="/register" class="text-decoration-none">Register here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-success alert-dismissible fade show mt-3" *ngIf="successMessage" role="alert">
      <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
      <button type="button" class="btn-close" (click)="successMessage = ''"></button>
    </div>

    <div class="alert alert-danger alert-dismissible fade show mt-3" *ngIf="errorMessage" role="alert">
      <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
      <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .form-control:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    
    .btn-primary:disabled {
      background-color: #6c757d;
      border-color: #6c757d;
    }
  `]
})
export class LoginComponent {
  loginData: LoginRequest = {
    username: '',
    password: ''
  };
  
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.successMessage = 'Login successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid username or password. Please try again.';
        this.loading = false;
      }
    });
  }
} 