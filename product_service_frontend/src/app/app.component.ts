import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="fas fa-store me-2"></i>E-Commerce Store
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="fas fa-home me-1"></i>Home
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item me-3" *ngIf="authService.isLoggedIn()">
              <a class="nav-link position-relative" routerLink="/cart" routerLinkActive="active">
                <i class="fas fa-shopping-cart me-1"></i>Cart
                <span class="cart-badge" *ngIf="cartService.getCartItemCount() > 0">
                  {{ cartService.getCartItemCount() }}
                </span>
              </a>
            </li>
            
            <li class="nav-item" *ngIf="!authService.isLoggedIn()">
              <a class="nav-link" routerLink="/login" routerLinkActive="active">
                <i class="fas fa-sign-in-alt me-1"></i>Login
              </a>
            </li>
            
            <li class="nav-item" *ngIf="!authService.isLoggedIn()">
              <a class="nav-link" routerLink="/register" routerLinkActive="active">
                <i class="fas fa-user-plus me-1"></i>Register
              </a>
            </li>
            
            <li class="nav-item dropdown" *ngIf="authService.isLoggedIn()">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>{{ authService.getCurrentUser()?.username }}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" (click)="logout()">
                  <i class="fas fa-sign-out-alt me-1"></i>Logout
                </a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-4">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar-nav .nav-link.active {
      color: #007bff !important;
      font-weight: 500;
    }
    
    .dropdown-menu {
      border: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    public cartService: CartService
  ) {}

  logout(): void {
    this.authService.logout();
  }
} 