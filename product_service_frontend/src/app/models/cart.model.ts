export interface CartItem {
  id: number; // cartItemId for removing specific items
  productId: number;
  quantity: number;
  price: number;
  productName: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export interface CheckoutResponse {
  message: string;
} 