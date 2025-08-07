import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:8080/api';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();
  private imageUrlsStorage = new Map<number, string>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    this.loadImageUrlsFromStorage();
  }

  private loadImageUrlsFromStorage(): void {
    const stored = localStorage.getItem('productImageUrls');
    if (stored) {
      this.imageUrlsStorage = new Map(JSON.parse(stored));
    }
  }

  private saveImageUrlsToStorage(): void {
    localStorage.setItem('productImageUrls', JSON.stringify(Array.from(this.imageUrlsStorage.entries())));
  }

  getProducts(): Observable<Product[]> {
    // Fetch products from your Spring Boot backend
    return this.http.get<Product[]>(`${this.API_URL}/products`).pipe(
      tap(products => {
        // Add image URLs from local storage
        const productsWithImages = products.map(product => ({
          ...product,
          imageUrl: this.imageUrlsStorage.get(product.id) || product.imageUrl
        }));
        
        // Only update if we don't have products already (to preserve local stock changes)
        if (this.productsSubject.value.length === 0) {
          this.productsSubject.next(productsWithImages);
        }
      })
    );
  }

  updateProductStock(productId: number, quantityReduced: number): void {
    const currentProducts = this.productsSubject.value;
    const updatedProducts = currentProducts.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          quantity: Math.max(0, product.quantity - quantityReduced)
        };
      }
      return product;
    });
    this.productsSubject.next(updatedProducts);
  }

  getProductById(productId: number): Product | undefined {
    return this.productsSubject.value.find(product => product.id === productId);
  }

  addProduct(productData: { name: string; description: string; price: number; quantity: number; imageUrl?: string }): Observable<Product> {
    const headers = this.getAuthHeaders();
    return this.http.post<Product>(`${this.API_URL}/products`, productData, { headers }).pipe(
      tap(newProduct => {
        // Add the new product to the local state
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, newProduct]);
      })
    );
  }

  updateProduct(productData: Product): Observable<Product> {
    const headers = this.getAuthHeaders();
    return this.http.put<Product>(`${this.API_URL}/products/${productData.id}`, productData, { headers }).pipe(
      tap(updatedProduct => {
        // Update the product in the local state
        const currentProducts = this.productsSubject.value;
        const updatedProducts = currentProducts.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        );
        this.productsSubject.next(updatedProducts);
      })
    );
  }

  deleteProduct(productId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.API_URL}/products/${productId}`, { headers }).pipe(
      tap(() => {
        // Remove the product from the local state
        const currentProducts = this.productsSubject.value;
        const updatedProducts = currentProducts.filter(product => product.id !== productId);
        this.productsSubject.next(updatedProducts);
      })
    );
  }

  updateProductImageUrl(productId: number, imageUrl: string): void {
    this.imageUrlsStorage.set(productId, imageUrl);
    this.saveImageUrlsToStorage();
    
    // Update the product in the current state
    const currentProducts = this.productsSubject.value;
    const updatedProducts = currentProducts.map(product => 
      product.id === productId ? { ...product, imageUrl } : product
    );
    this.productsSubject.next(updatedProducts);
  }

  getProductImageUrl(productId: number): string | undefined {
    return this.imageUrlsStorage.get(productId);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
} 