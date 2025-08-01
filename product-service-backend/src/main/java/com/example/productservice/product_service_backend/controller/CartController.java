package com.example.productservice.product_service_backend.controller;

import com.example.productservice.product_service_backend.dto.CartDto;
import com.example.productservice.product_service_backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
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
        cartService.removeFromCart(authentication.getName(), cartItemId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(Authentication authentication) {
        cartService.checkout(authentication.getName());
        return ResponseEntity.ok().body("Checkout successful");
    }
}
