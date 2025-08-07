package com.example.productservice.product_service_backend.controller;

import com.example.productservice.product_service_backend.dto.CartDto;
import com.example.productservice.product_service_backend.dto.PaymentRequest;
import com.example.productservice.product_service_backend.dto.PaymentResponse;
import com.example.productservice.product_service_backend.service.CartService;
import com.example.productservice.product_service_backend.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    private final CartService cartService;
    private final PaymentService paymentService;

    public CartController(CartService cartService, PaymentService paymentService) {
        this.cartService = cartService;
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(Authentication authentication) {
        CartDto cart = cartService.getCart(authentication.getName());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<CartDto> addToCart(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") int quantity,
            Authentication authentication) {
        CartDto updatedCart = cartService.addToCart(authentication.getName(), productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long cartItemId,
            Authentication authentication) {
        try {
            cartService.removeFromCart(authentication.getName(), cartItemId);
            return ResponseEntity.ok().body("Item removed from cart successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        try {
            cartService.clearCart(authentication.getName());
            return ResponseEntity.ok().body("Cart cleared successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(Authentication authentication) {
        try {
            // Get cart details
            CartDto cart = cartService.getCart(authentication.getName());
            
            if (cart.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body("Cart is empty");
            }

            // Create payment request
            PaymentRequest paymentRequest = new PaymentRequest();
            paymentRequest.setAmount(cart.getTotal());
            paymentRequest.setCurrency("INR");
            paymentRequest.setReceipt(paymentService.generateReceipt());

            // Create Razorpay order
            PaymentResponse paymentResponse = paymentService.createOrder(paymentRequest);
            
            return ResponseEntity.ok(paymentResponse);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Payment initialization failed");
        }
    }

    @PostMapping("/complete-checkout")
    public ResponseEntity<?> completeCheckout(Authentication authentication) {
        cartService.checkout(authentication.getName());
        return ResponseEntity.ok().body("Checkout successful");
    }
}
