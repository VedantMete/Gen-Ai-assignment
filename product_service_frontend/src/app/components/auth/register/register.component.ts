import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">
              <i class="fas fa-user-plus me-2"></i>Register
            </h2>
            
            <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="username"
                  name="username"
                  [(ngModel)]="registerData.username"
                  required
                  minlength="3"
                  #username="ngModel">
                <div class="invalid-feedback" *ngIf="username.invalid && username.touched">
                  <span *ngIf="username.errors?.['required']">Username is required.</span>
                  <span *ngIf="username.errors?.['minlength']">Username must be at least 3 characters.</span>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email"
                  name="email"
                  [(ngModel)]="registerData.email"
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  #email="ngModel">
                <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
                  <span *ngIf="email.errors?.['required']">Email is required.</span>
                  <span *ngIf="email.errors?.['pattern']">Please enter a valid email address.</span>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password"
                  name="password"
                  [(ngModel)]="registerData.password"
                  required
                  minlength="3"
                  #password="ngModel">
                <div class="invalid-feedback" *ngIf="password.invalid && password.touched">
                  <span *ngIf="password.errors?.['required']">Password is required.</span>
                  <span *ngIf="password.errors?.['minlength']">Password must be at least 3 characters.</span>
                </div>
              </div>
              
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="loading || registerForm.invalid">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  <i class="fas fa-user-plus me-2" *ngIf="!loading"></i>
                  {{ loading ? 'Registering...' : 'Register' }}
                </button>
              </div>
            </form>
            
            <div class="text-center mt-3">
              <p class="mb-0">Already have an account? 
                <a routerLink="/login" class="text-decoration-none">Login here</a>
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
export class RegisterComponent {
  registerData: RegisterRequest = {
    username: '',
    email: '',
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

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Please login to continue.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.errorMessage = 'Registration failed. Username or email might already be taken.';
        this.loading = false;
      }
    });
  }
} 