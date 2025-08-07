package com.example.productservice.product_service_backend.repository;

import com.example.productservice.product_service_backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
