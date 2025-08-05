import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">
          <i class="fas fa-shopping-bag me-2"></i>Welcome to Our Store
        </h1>
        <p class="text-muted mb-4">Discover amazing products at great prices!</p>
      </div>
    </div>

    <div class="row" *ngIf="loading">
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div class="row" *ngIf="!loading && products.length === 0">
      <div class="col-12 text-center">
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>No products available at the moment.
        </div>
      </div>
    </div>

    <div class="row" *ngIf="!loading && products.length > 0">
      <div class="col-md-4 mb-4" *ngFor="let product of products">
        <div class="card product-card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text text-muted">{{ product.description }}</p>
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="h5 text-primary mb-0">{{ product.price }}</span>
                <span class="badge bg-secondary">{{ product.quantity }} in stock</span>
              </div>
              
              <div class="d-flex align-items-center mb-3" *ngIf="authService.isLoggedIn()">
                <label for="quantity-{{ product.id }}" class="form-label me-2 mb-0">Qty:</label>
                <input 
                  type="number" 
                  class="form-control form-control-sm" 
                  style="width: 80px;"
                  id="quantity-{{ product.id }}"
                  [(ngModel)]="quantities[product.id]"
                  min="1"
                  max="{{ product.quantity }}"
                  value="1">
              </div>
              
              <button 
                class="btn btn-primary w-100" 
                (click)="addToCart(product)"
                [disabled]="!authService.isLoggedIn() || quantities[product.id] < 1 || quantities[product.id] > product.quantity">
                <i class="fas fa-cart-plus me-2"></i>
                {{ authService.isLoggedIn() ? 'Add to Cart' : 'Login to Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="alert alert-success alert-dismissible fade show" *ngIf="successMessage" role="alert">
      <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
      <button type="button" class="btn-close" (click)="successMessage = ''"></button>
    </div>

    <div class="alert alert-danger alert-dismissible fade show" *ngIf="errorMessage" role="alert">
      <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
      <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
    </div>
  `,
  styles: [`
    .card-title {
      color: #333;
      font-weight: 600;
    }
    
    .text-primary {
      color: #007bff !important;
    }
    
    .badge {
      font-size: 0.8rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';
  quantities: { [key: number]: number } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Subscribe to the product service observable for real-time updates
    this.productService.products$.subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        // Initialize quantities
        products.forEach(product => {
          this.quantities[product.id] = 1;
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
    
    // Trigger the initial load of products
    this.productService.getProducts().subscribe();
  }

  addToCart(product: Product): void {
    const quantity = this.quantities[product.id] || 1;
    
    if (quantity < 1 || quantity > product.quantity) {
      this.errorMessage = 'Please enter a valid quantity.';
      return;
    }

    this.cartService.addToCart(product.id, quantity).subscribe({
      next: () => {
        this.successMessage = `${product.name} added to cart successfully!`;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.errorMessage = 'Failed to add item to cart. Please try again.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
} 