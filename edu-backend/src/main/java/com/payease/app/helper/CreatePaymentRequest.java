package com.payease.app.helper;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {

    private String customerName;
    private String  customerMobileNo;
    private String customerEmailId;
    private BigDecimal amount;
    private String gateway;
    private String paymentMode; // CARD / UPI / IMPS
    private String paymentType; // VISA / DEFAULT
    private String orderId;

}
