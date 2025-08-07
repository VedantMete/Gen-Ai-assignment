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
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid px-4">
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <i class="fas fa-store fa-lg me-2 text-warning"></i>
          <span class="fs-3 fw-bold text-white">ShopEase</span>
        </a>
        
        <div class="d-none d-lg-flex mx-auto w-50">
          <div class="input-group">
            <input class="form-control border-0" type="search" placeholder="Search for products, brands and more" aria-label="Search">
            <button class="btn btn-warning" type="submit">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item me-3" *ngIf="authService.isLoggedIn()">
              <a class="nav-link position-relative text-white" routerLink="/cart" routerLinkActive="active">
                <i class="fas fa-shopping-cart me-1"></i>Cart
                <span class="cart-badge" *ngIf="cartService.getCartItemCount() > 0">
                  {{ cartService.getCartItemCount() }}
                </span>
              </a>
            </li>
            <li class="nav-item" *ngIf="!authService.isLoggedIn()">
              <a class="nav-link text-white" routerLink="/login" routerLinkActive="active">
                <i class="fas fa-sign-in-alt me-1"></i>Login
              </a>
            </li>
            <li class="nav-item" *ngIf="!authService.isLoggedIn()">
              <a class="nav-link text-white" routerLink="/register" routerLinkActive="active">
                <i class="fas fa-user-plus me-1"></i>Register
              </a>
            </li>
            <li class="nav-item dropdown" *ngIf="authService.isLoggedIn()">
              <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                <i class="fas fa-user me-1"></i>{{ authService.getCurrentUser()?.username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li *ngIf="authService.isAdmin()">
                  <a class="dropdown-item" routerLink="/admin">
                    <i class="fas fa-cogs me-1"></i>Admin Dashboard
                  </a>
                </li>
                <li><hr class="dropdown-divider" *ngIf="authService.isAdmin()"></li>
                <li><a class="dropdown-item" href="#" (click)="logout()">
                  <i class="fas fa-sign-out-alt me-1"></i>Logout
                </a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
    }
    
    .navbar-nav .nav-link.active {
      color: #ffc107 !important;
      font-weight: 500;
    }
    
    .navbar-nav .nav-link:hover {
      color: #ffc107 !important;
    }
    
    .dropdown-menu {
      border: none;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border-radius: 12px;
    }
    
    .input-group .form-control {
      border-radius: 8px 0 0 8px;
      border: 2px solid #e0e0e0;
    }
    
    .input-group .btn {
      border-radius: 0 8px 8px 0;
      border: 2px solid #ffc107;
    }
    
    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #dc3545;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
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