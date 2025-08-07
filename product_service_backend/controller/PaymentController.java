package com.example.productservice.product_service_backend.controller;

import com.example.productservice.product_service_backend.dto.PaymentRequest;
import com.example.productservice.product_service_backend.dto.PaymentResponse;
import com.example.productservice.product_service_backend.dto.PaymentVerificationRequest;
import com.example.productservice.product_service_backend.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createOrder(@RequestBody PaymentRequest paymentRequest) {
        try {
            PaymentResponse response = paymentService.createOrder(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest verificationRequest) {
        boolean isValid = paymentService.verifyPayment(verificationRequest);
        if (isValid) {
            return ResponseEntity.ok().body("Payment verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Payment verification failed");
        }
    }
}
