import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart, CartItem, CheckoutResponse } from '../models/cart.model';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

export interface RazorpayResponse {
  orderId: string;
  currency: string;
  amount: string;
  key: string;
  name: string;
  description: string;
  prefillEmail: string | null;
  prefillContact: string | null;
  themeColor: string;
}

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
    const headers = this.getAuthHeaders();
    return this.http.post<Cart>(`${this.API_URL}/cart/add/${productId}?quantity=${quantity}`, {}, { headers }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
      })
    );
  }

  getCart(): Observable<Cart> {
    const headers = this.getAuthHeaders();
    return this.http.get<Cart>(`${this.API_URL}/cart`, { headers }).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
      })
    );
  }

  getCartItems(): CartItem[] {
    return this.cartSubject.value?.items || [];
  }

  getCartTotal(): number {
    return this.cartSubject.value?.total || 0;
  }

  getCartItemCount(): number {
    return this.getCartItems().reduce((total, item) => total + item.quantity, 0);
  }

  removeFromCart(cartItemId: number): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.API_URL}/cart/items/${cartItemId}`, { 
      headers, 
      responseType: 'text' 
    }).pipe(
      tap(() => {
        // Refresh cart after removing item
        this.getCart().subscribe();
      })
    );
  }

  clearCart(): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.API_URL}/cart/clear`, { 
      headers, 
      responseType: 'text' 
    }).pipe(
      tap(() => {
        // Clear cart in memory
        this.cartSubject.next({ id: 0, items: [], total: 0 });
      })
    );
  }

  // Method to handle successful payment completion
  onPaymentSuccess(): void {
    // Clear cart in memory after successful payment
    this.cartSubject.next({ id: 0, items: [], total: 0 });
  }

  checkout(): Observable<RazorpayResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<RazorpayResponse>(`${this.API_URL}/cart/checkout`, {}, { headers });
  }

  processPayment(razorpayResponse: RazorpayResponse): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        key: razorpayResponse.key,
        amount: razorpayResponse.amount,
        currency: razorpayResponse.currency,
        name: razorpayResponse.name,
        description: razorpayResponse.description,
        order_id: razorpayResponse.orderId,
        prefill: {
          email: razorpayResponse.prefillEmail,
          contact: razorpayResponse.prefillContact
        },
        theme: {
          color: razorpayResponse.themeColor
        },
        handler: (response: any) => {
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled'));
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
} 