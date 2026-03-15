package com.payease.app.controller;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentResponse {
    private BigDecimal amount;
    private String checkoutUrl;
    private String terminalNo;
    private String token;
    private String customerName;
    private String  customerMobileNo;
    private String customerEmailId;
}
