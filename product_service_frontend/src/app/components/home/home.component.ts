import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-white mb-4">
              Discover Amazing Products
            </h1>
            <p class="lead text-white-50 mb-4">
              Shop the latest trends with premium quality and unbeatable prices. 
              Your one-stop destination for everything you need.
            </p>
            <button class="btn btn-warning btn-lg px-4 py-3 fw-bold">
              <i class="fas fa-shopping-bag me-2"></i>Shop Now
            </button>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-image">
              <i class="fas fa-shopping-cart fa-10x text-white-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-12">
          <h2 class="section-title mb-4">Shop by Category</h2>
        </div>
      </div>
      <div class="row g-4 mb-5">
        <div class="col-md-3 col-6">
          <div class="category-card">
            <div class="category-icon">
              <i class="fas fa-laptop fa-2x"></i>
            </div>
            <h5>Electronics</h5>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="category-card">
            <div class="category-icon">
              <i class="fas fa-tshirt fa-2x"></i>
            </div>
            <h5>Fashion</h5>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="category-card">
            <div class="category-icon">
              <i class="fas fa-home fa-2x"></i>
            </div>
            <h5>Home & Garden</h5>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="category-card">
            <div class="category-icon">
              <i class="fas fa-gamepad fa-2x"></i>
            </div>
            <h5>Gaming</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2 class="section-title mb-4">Featured Products</h2>
        </div>
      </div>

      <div class="row" *ngIf="loading">
        <div class="col-12 text-center">
          <div class="spinner-border text-warning" role="status">
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

      <div class="row g-4" *ngIf="!loading && products.length > 0">
        <div class="col-lg-3 col-md-4 col-6" *ngFor="let product of products">
          <div class="product-card">
            <div class="product-image-container">
              <img 
                *ngIf="product.imageUrl && !imageError[product.id]" 
                [src]="product.imageUrl" 
                class="product-image" 
                alt="{{ product.name }}" 
                (error)="onImageError(product.id)"
                (load)="onImageLoad(product.id)">
              <div *ngIf="!product.imageUrl || imageError[product.id]" class="placeholder-image">
                <i class="fas fa-image fa-3x text-muted"></i>
                <p class="text-muted mt-2">{{ !product.imageUrl ? 'No Image' : 'Image Failed to Load' }}</p>
              </div>
              <div class="product-overlay">
                <button class="btn btn-warning btn-sm" (click)="handleAddToCart(product)">
                  <i class="fas fa-cart-plus me-1"></i>Add to Cart
                </button>
              </div>
            </div>
            <div class="product-info">
              <h5 class="product-title">{{ product.name }}</h5>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-price">
                <span class="price">₹{{ product.price | number:'1.2-2' }}</span>
                <span class="stock-badge" [class.in-stock]="product.quantity > 0" [class.out-of-stock]="product.quantity === 0">
                  {{ product.quantity > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
              <div class="quantity-selector" *ngIf="authService.isLoggedIn() && product.quantity > 0">
                <label class="quantity-label">Qty:</label>
                <input 
                  type="number" 
                  class="quantity-input" 
                  [(ngModel)]="quantities[product.id]"
                  min="1"
                  max="{{ product.quantity }}"
                  value="1">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter Section -->
    <div class="newsletter-section mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 text-center">
            <h3 class="text-white mb-3">Stay Updated</h3>
            <p class="text-white-50 mb-4">Get the latest deals and product updates delivered to your inbox.</p>
            <div class="input-group">
              <input type="email" class="form-control" placeholder="Enter your email">
              <button class="btn btn-warning">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Prompt Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title" id="loginModalLabel">
              <i class="fas fa-sign-in-alt me-2 text-warning"></i>Login Required
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <div class="mb-4">
              <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
              <h4>Please Login to Continue</h4>
              <p class="text-muted">You need to be logged in to add items to your cart.</p>
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-warning btn-lg" (click)="goToLogin()">
                <i class="fas fa-sign-in-alt me-2"></i>Login Now
              </button>
              <button class="btn btn-outline-secondary" (click)="goToRegister()">
                <i class="fas fa-user-plus me-2"></i>Create Account
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
  styles: [
    `
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 80px 0;
      position: relative;
      overflow: hidden;
    }
    
    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    }
    
    .min-vh-75 {
      min-height: 75vh;
    }
    
    .hero-image {
      opacity: 0.8;
    }
    
    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .category-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }
    
    .category-icon {
      color: #ffc107;
      margin-bottom: 1rem;
    }
    
    .category-card h5 {
      color: #333;
      font-weight: 600;
      margin: 0;
    }
    
    .product-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      position: relative;
    }
    
    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }
    
    .product-image-container {
      position: relative;
      height: 250px;
      background: #f8f9fa;
      overflow: hidden;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .product-card:hover .product-image {
      transform: scale(1.05);
    }
    
    .product-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .product-card:hover .product-overlay {
      opacity: 1;
    }
    
    .placeholder-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: #f8f9fa;
      color: #999;
    }
    
    .product-info {
      padding: 1.5rem;
    }
    
    .product-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }
    
    .product-description {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .product-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffc107;
    }
    
    .stock-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .in-stock {
      background: #d4edda;
      color: #155724;
    }
    
    .out-of-stock {
      background: #f8d7da;
      color: #721c24;
    }
    
    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .quantity-label {
      font-size: 0.9rem;
      color: #666;
      margin: 0;
    }
    
    .quantity-input {
      width: 60px;
      padding: 0.25rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
    }
    
    .newsletter-section {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 4rem 0;
    }
    
    .btn-warning {
      background: #ffc107;
      border-color: #ffc107;
      color: #000;
      font-weight: 600;
    }
    
    .btn-warning:hover {
      background: #e0a800;
      border-color: #e0a800;
      color: #000;
    }
     
     /* Modal Styles */
     .modal-content {
       border-radius: 16px;
       border: none;
       box-shadow: 0 20px 60px rgba(0,0,0,0.2);
     }
     
     .modal-header {
       background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
       border-radius: 16px 16px 0 0;
     }
     
     .modal-title {
       color: #333;
       font-weight: 600;
     }
     
     .modal-body {
       padding: 2rem;
     }
     
     .btn-outline-secondary {
       border-color: #6c757d;
       color: #6c757d;
       font-weight: 500;
     }
     
     .btn-outline-secondary:hover {
       background-color: #6c757d;
       border-color: #6c757d;
       color: white;
     }
    `
  ]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';
  quantities: { [key: number]: number } = {};
  imageError: { [key: number]: boolean } = {};
  loginModal: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    // Initialize Bootstrap modal
    this.loginModal = new (window as any).bootstrap.Modal(document.getElementById('loginModal'));
  }

  loadProducts(): void {
    // Subscribe to the product service observable for real-time updates
    this.productService.products$.subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        // Initialize quantities and add default images for testing
        products.forEach(product => {
          this.quantities[product.id] = 1;
          // Add default image only if imageUrl is missing or empty
          if (!product.imageUrl || (typeof product.imageUrl === 'string' && product.imageUrl.trim() === '')) {
            product.imageUrl = this.getDefaultImageUrl(product.id);
          }
          console.log(`Product ${product.id}: ${product.name} - Image URL: ${product.imageUrl}`);
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

  private getDefaultImageUrl(productId: number): string {
    // Generate different placeholder images based on product ID
    const imageUrls = [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2', 
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4',
      'https://picsum.photos/400/400?random=5',
      'https://via.placeholder.com/400x400/007bff/ffffff?text=Product',
      'https://via.placeholder.com/400x400/28a745/ffffff?text=Laptop',
      'https://via.placeholder.com/400x400/dc3545/ffffff?text=Mobile'
    ];
    return imageUrls[productId % imageUrls.length];
  }

  handleAddToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      // Show login modal
      this.loginModal.show();
      return;
    }
    
    // Proceed with adding to cart if logged in
    this.addToCart(product);
  }

  addToCart(product: Product): void {
    const quantity = this.quantities[product.id] || 1;
    
    if (quantity < 1 || quantity > product.quantity) {
      this.errorMessage = 'Please enter a valid quantity.';
      return;
    }

    this.cartService.addToCart(product.id, quantity).subscribe({
      next: () => {
        this.successMessage = `${product.name} (${quantity} item${quantity > 1 ? 's' : ''}) added to cart successfully!`;
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

  onImageError(productId: number): void {
    this.imageError[productId] = true;
  }

  onImageLoad(productId: number): void {
    this.imageError[productId] = false;
  }

  goToLogin(): void {
    this.loginModal.hide();
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.loginModal.hide();
    this.router.navigate(['/register']);
  }
} 