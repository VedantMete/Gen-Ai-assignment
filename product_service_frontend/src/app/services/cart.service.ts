import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart, CartItem, CheckoutResponse } from '../models/cart.model';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'http://localhost:8080/api';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  addToCart(productId: number, quantity: number): Observable<Cart> {
    // Simulate adding to cart for demo purposes
    return new Observable<Cart>(observer => {
      setTimeout(() => {
        // Get actual product data
        const product = this.productService.getProductById(productId);
        if (!product) {
          observer.error('Product not found');
          return;
        }
        
        // Check if product has enough stock
        if (product.quantity < quantity) {
          observer.error('Insufficient stock');
          return;
        }
        
        // Create cart item with actual product data
        const cartItem: CartItem = {
          productId: productId,
          quantity: quantity,
          price: product.price,
          productName: product.name
        };
        
        // Get current cart or create new one
        const currentCart = this.cartSubject.value || { id: 1, items: [], total: 0 };
        const updatedItems = [...currentCart.items, cartItem];
        const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const updatedCart: Cart = {
          id: currentCart.id,
          items: updatedItems,
          total: updatedTotal
        };
        
        this.cartSubject.next(updatedCart);
        observer.next(updatedCart);
        observer.complete();
      }, 500); // Simulate 0.5 second delay
    });
  }

  checkout(): Observable<CheckoutResponse> {
    // Simulate successful checkout for demo purposes
    return new Observable<CheckoutResponse>(observer => {
      setTimeout(() => {
        // Reduce stock for each item in cart
        const currentCart = this.cartSubject.value;
        if (currentCart && currentCart.items.length > 0) {
          currentCart.items.forEach(item => {
            this.productService.updateProductStock(item.productId, item.quantity);
          });
        }
        
        observer.next({
          message: 'Checkout successful!'
        });
        // Clear cart after successful checkout
        this.cartSubject.next(null);
        observer.complete();
      }, 1000); // Simulate 1 second delay
    });
  }

  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.total : 0;
  }

  getCartItems(): CartItem[] {
    const cart = this.cartSubject.value;
    return cart ? cart.items : [];
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


} 