package com.example.productservice.product_service_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDto {
    private Long id;  // Cart item ID for removal
    private Long productId;
    private int quantity;
    private BigDecimal price;
    private String productName;
}
