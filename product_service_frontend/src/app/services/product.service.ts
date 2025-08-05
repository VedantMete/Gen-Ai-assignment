import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://localhost:8080/api';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    // Fetch products from your Spring Boot backend
    return this.http.get<Product[]>(`${this.API_URL}/products`).pipe(
      tap(products => {
        // Only update if we don't have products already (to preserve local stock changes)
        if (this.productsSubject.value.length === 0) {
          this.productsSubject.next(products);
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
} 