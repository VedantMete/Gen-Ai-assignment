import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, RazorpayResponse } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
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
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title mb-0">Cart Items</h5>
                <button 
                  class="btn btn-outline-danger btn-sm"
                  (click)="clearCart()"
                  [disabled]="loading">
                  <i class="fas fa-trash me-1"></i>Clear Cart
                </button>
              </div>
              
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of cartItems">
                      <td>
                        <strong>{{ item.productName }}</strong>
                      </td>
                      <td>₹{{ item.price | number:'1.2-2' }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>₹{{ (item.price * item.quantity) | number:'1.2-2' }}</td>
                      <td>
                        <button 
                          class="btn btn-outline-danger btn-sm"
                          (click)="removeItem(item.id)"
                          [disabled]="loading">
                          <i class="fas fa-times"></i>
                        </button>
                      </td>
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
                <span>₹{{ cartTotal | number:'1.2-2' }}</span>
              </div>
              
              <hr>
              
              <div class="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong class="text-primary">₹{{ cartTotal | number:'1.2-2' }}</strong>
              </div>
              
              <div class="d-grid">
                <button 
                  class="btn btn-success btn-lg"
                  (click)="initiateCheckout()"
                  [disabled]="loading">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  <i class="fas fa-credit-card me-2" *ngIf="!loading"></i>
                  {{ loading ? 'Processing...' : 'Proceed to Payment' }}
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
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      border: none;
      box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    }
    
    .btn-success:hover {
      background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
    }
    
    .btn-outline-danger {
      transition: all 0.3s ease;
    }
    
    .btn-outline-danger:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
    }
    
    .text-primary {
      color: #ffc107 !important;
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
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.items;
        this.cartTotal = cart.total;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.errorMessage = 'Failed to load cart. Please try again.';
      }
    });
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  initiateCheckout(): void {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.checkout().subscribe({
      next: (razorpayResponse: RazorpayResponse) => {
        this.processPayment(razorpayResponse);
      },
      error: (error) => {
        console.error('Checkout error:', error);
        this.errorMessage = 'Failed to initiate checkout. Please try again.';
        this.loading = false;
      }
    });
  }

  private processPayment(razorpayResponse: RazorpayResponse): void {
    this.cartService.processPayment(razorpayResponse)
      .then((response) => {
        console.log('Payment successful:', response);
        this.successMessage = 'Payment successful! Thank you for your purchase.';
        this.loading = false;
        
        // Clear cart on backend and redirect after successful payment
        this.cartService.clearCart().subscribe({
          next: () => {
            console.log('Cart cleared after successful payment');
            // Update local state and notify service
            this.cartService.onPaymentSuccess();
            this.cartItems = [];
            this.cartTotal = 0;
            // Redirect to home page
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error clearing cart after payment:', error);
            // Still update local state and redirect even if backend clearing fails
            this.cartService.onPaymentSuccess();
            this.cartItems = [];
            this.cartTotal = 0;
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          }
        });
      })
      .catch((error) => {
        console.error('Payment failed:', error);
        this.errorMessage = error.message === 'Payment cancelled' 
          ? 'Payment was cancelled.' 
          : 'Payment failed. Please try again.';
        this.loading = false;
      });
  }

  removeItem(itemId: number): void {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.loadCart(); // Reload cart to update total and remove item
        this.successMessage = 'Item removed from cart.';
      },
      error: (error: any) => {
        console.error('Error removing item:', error);
        this.errorMessage = 'Failed to remove item from cart. Please try again.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  clearCart(): void {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cartService.clearCart().subscribe({
      next: () => {
        this.loadCart(); // Reload cart to update total and clear items
        this.successMessage = 'Cart cleared successfully.';
      },
      error: (error: any) => {
        console.error('Error clearing cart:', error);
        this.errorMessage = 'Failed to clear cart. Please try again.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
} 