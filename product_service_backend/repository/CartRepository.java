package com.example.productservice.product_service_backend.repository;

import com.example.productservice.product_service_backend.entity.Cart;
import com.example.productservice.product_service_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
