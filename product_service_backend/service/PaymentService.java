package com.example.productservice.product_service_backend.service;

import com.example.productservice.product_service_backend.dto.PaymentRequest;
import com.example.productservice.product_service_backend.dto.PaymentResponse;
import com.example.productservice.product_service_backend.dto.PaymentVerificationRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.merchant.name}")
    private String merchantName;

    @Value("${razorpay.merchant.description}")
    private String merchantDescription;

    @Value("${razorpay.merchant.theme.color}")
    private String themeColor;

    public PaymentResponse createOrder(PaymentRequest paymentRequest) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", paymentRequest.getAmount().multiply(new BigDecimal("100")).intValue()); // Convert to paise
        orderRequest.put("currency", paymentRequest.getCurrency());
        orderRequest.put("receipt", paymentRequest.getReceipt());

        Order order = razorpayClient.orders.create(orderRequest);

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setOrderId(order.get("id").toString());
        paymentResponse.setCurrency(paymentRequest.getCurrency());
        paymentResponse.setAmount(paymentRequest.getAmount().toString());
        paymentResponse.setKey(razorpayKeyId);
        paymentResponse.setName(merchantName);
        paymentResponse.setDescription(merchantDescription);
        paymentResponse.setThemeColor(themeColor);

        return paymentResponse;
    }

    public boolean verifyPayment(PaymentVerificationRequest verificationRequest) {
        try {
            String data = verificationRequest.getRazorpayOrderId() + "|" + verificationRequest.getRazorpayPaymentId();
            String generatedSignature = generateSignature(data, razorpayKeySecret);
            
            return generatedSignature.equals(verificationRequest.getRazorpaySignature());
        } catch (Exception e) {
            return false;
        }
    }

    private String generateSignature(String data, String secret) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest((data + secret).getBytes());
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public String generateReceipt() {
        return "receipt_" + UUID.randomUUID().toString().replace("-", "");
    }
}
