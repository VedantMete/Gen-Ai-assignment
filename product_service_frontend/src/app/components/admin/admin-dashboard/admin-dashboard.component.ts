import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">
            <i class="fas fa-cogs me-2"></i>Admin Dashboard
          </h1>
          <p class="text-muted mb-4">Manage your products inventory</p>
        </div>
      </div>

      <!-- Add/Edit Product Form -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-plus me-2"></i>
                {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
              </h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="onSubmit()" #form="ngForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">Product Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="name"
                      name="name"
                      [(ngModel)]="productForm.name"
                      required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="price" class="form-label">Price</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="price"
                      name="price"
                      [(ngModel)]="productForm.price"
                      step="0.01"
                      min="0"
                      required>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="quantity" class="form-label">Quantity</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="quantity"
                      name="quantity"
                      [(ngModel)]="productForm.quantity"
                      min="0"
                      required>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea 
                      class="form-control" 
                      id="description"
                      name="description"
                      [(ngModel)]="productForm.description"
                      rows="3"
                      required></textarea>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 mb-3">
                    <label for="imageUrl" class="form-label">Image URL</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="imageUrl"
                      name="imageUrl"
                      [(ngModel)]="productForm.imageUrl"
                      placeholder="Enter image URL (e.g., https://picsum.photos/400/400)">
                    <div class="form-text">
                      <small class="text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        Recommended: 400x400px images. Try: 
                        <a href="https://picsum.photos/400/400" target="_blank" class="text-decoration-none">Picsum</a> | 
                        <a href="https://unsplash.com" target="_blank" class="text-decoration-none">Unsplash</a> | 
                        <a href="https://pexels.com" target="_blank" class="text-decoration-none">Pexels</a>
                      </small>
                    </div>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!form.form.valid || loading">
                    <i class="fas fa-save me-2"></i>
                    {{ editingProduct ? 'Update Product' : 'Add Product' }}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelEdit()" *ngIf="editingProduct">
                    <i class="fas fa-times me-2"></i>Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-list me-2"></i>Products Inventory
              </h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let product of products">
                      <td>{{ product.id }}</td>
                      <td>{{ product.name }}</td>
                      <td>{{ product.description }}</td>
                      <td>{{ product.price | currency }}</td>
                      <td>
                        <span class="badge" [ngClass]="product.quantity > 0 ? 'bg-success' : 'bg-danger'">
                          {{ product.quantity }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group" role="group">
                          <button class="btn btn-sm btn-outline-primary" (click)="editProduct(product)">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" (click)="deleteProduct(product.id)">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success/Error Messages -->
      <div class="alert alert-success alert-dismissible fade show" *ngIf="successMessage" role="alert">
        <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
        <button type="button" class="btn-close" (click)="successMessage = ''"></button>
      </div>

      <div class="alert alert-danger alert-dismissible fade show" *ngIf="errorMessage" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
        <button type="button" class="btn-close" (click)="errorMessage = ''"></button>
      </div>
    </div>
  `,
  styles: [`
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }
    
    .btn-group .btn {
      margin-right: 5px;
    }
    
    .table th {
      background-color: #f8f9fa;
      border-top: none;
    }
    
    .badge {
      font-size: 0.875rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  editingProduct: Product | null = null;
  productForm = {
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    imageUrl: ''
  };

  constructor(
    private productService: ProductService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.products$.subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products.';
      }
    });
    
    this.productService.getProducts().subscribe();
  }

  onSubmit(): void {
    if (this.editingProduct) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }

  addProduct(): void {
    this.loading = true;
    const productData = {
      name: this.productForm.name,
      description: this.productForm.description,
      price: this.productForm.price,
      quantity: this.productForm.quantity
    };
    
    this.productService.addProduct(productData).subscribe({
      next: (product) => {
        // Save image URL to local storage if provided
        if (this.productForm.imageUrl && this.productForm.imageUrl.trim()) {
          this.productService.updateProductImageUrl(product.id, this.productForm.imageUrl.trim());
        }
        
        this.successMessage = 'Product added successfully!';
        this.resetForm();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.errorMessage = `Failed to add product: ${error.error?.message || error.message || 'Unknown error'}`;
        this.loading = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  updateProduct(): void {
    if (!this.editingProduct) return;
    
    this.loading = true;
    const updatedProduct = {
      ...this.productForm,
      id: this.editingProduct.id
    };
    
    this.productService.updateProduct(updatedProduct).subscribe({
      next: (product) => {
        // Save image URL to local storage if provided
        if (this.productForm.imageUrl && this.productForm.imageUrl.trim()) {
          this.productService.updateProductImageUrl(product.id, this.productForm.imageUrl.trim());
        }
        
        this.successMessage = 'Product updated successfully!';
        this.resetForm();
        this.loading = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.errorMessage = `Failed to update product: ${error.error?.message || error.message || 'Unknown error'}`;
        this.loading = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    // Load image URL from local storage
    const storedImageUrl = this.productService.getProductImageUrl(product.id);
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      imageUrl: storedImageUrl || product.imageUrl || ''
    };
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.resetForm();
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.successMessage = 'Product deleted successfully!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.errorMessage = `Failed to delete product: ${error.error?.message || error.message || 'Unknown error'}`;
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }

  private resetForm(): void {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      imageUrl: ''
    };
    this.editingProduct = null;
  }
} 