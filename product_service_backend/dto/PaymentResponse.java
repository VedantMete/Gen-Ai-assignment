package com.example.productservice.product_service_backend.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private String orderId;
    private String currency;
    private String amount;
    private String key;
    private String name;
    private String description;
    private String prefillEmail;
    private String prefillContact;
    private String themeColor;
}
