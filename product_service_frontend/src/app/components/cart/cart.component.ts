import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">
          <i class="fas fa-shopping-cart me-2"></i>Shopping Cart
        </h1>
      </div>
    </div>

    <div class="row" *ngIf="cartItems.length === 0">
      <div class="col-12">
        <div class="alert alert-info text-center">
          <i class="fas fa-info-circle me-2"></i>Your cart is empty. 
          <a routerLink="/" class="alert-link">Continue shopping</a>
        </div>
      </div>
    </div>

    <div class="row" *ngIf="cartItems.length > 0">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">Cart Items</h5>
            
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of cartItems">
                    <td>
                      <strong>{{ item.productName }}</strong>
                    </td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">Order Summary</h5>
            
            <div class="d-flex justify-content-between mb-2">
              <span>Items ({{ getTotalItems() }}):</span>
              <span>{{ cartTotal.toFixed(2) }}</span>
            </div>
            
            <hr>
            
            <div class="d-flex justify-content-between mb-3">
              <strong>Total:</strong>
              <strong class="text-primary">{{ cartTotal.toFixed(2) }}</strong>
            </div>
            
            <div class="d-grid">
              <button 
                class="btn btn-success btn-lg"
                (click)="checkout()"
                [disabled]="loading">
                <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                <i class="fas fa-credit-card me-2" *ngIf="!loading"></i>
                {{ loading ? 'Processing...' : 'Checkout' }}
              </button>
            </div>
            
            <div class="text-center mt-3">
              <a routerLink="/" class="text-decoration-none">
                <i class="fas fa-arrow-left me-1"></i>Continue Shopping
              </a>
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
    .table th {
      border-top: none;
      font-weight: 600;
      color: #495057;
    }
    
    .table td {
      vertical-align: middle;
    }
    
    .btn-success {
      background-color: #28a745;
      border-color: #28a745;
    }
    
    .btn-success:hover {
      background-color: #218838;
      border-color: #1e7e34;
    }
    
    .text-primary {
      color: #007bff !important;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal();
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  checkout(): void {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.checkout().subscribe({
      next: (response) => {
        this.successMessage = 'Checkout successful! Thank you for your purchase.';
        // Clear cart after successful checkout
        setTimeout(() => {
          this.cartItems = [];
          this.cartTotal = 0;
          // Redirect to homepage after successful checkout
          this.router.navigate(['/']);
        }, 2000);
        this.loading = false;
      },
      error: (error) => {
        console.error('Checkout error:', error);
        this.errorMessage = 'Checkout failed. Please try again.';
        this.loading = false;
      }
    });
  }
} 