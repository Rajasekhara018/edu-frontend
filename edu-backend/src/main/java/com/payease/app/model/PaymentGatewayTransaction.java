package com.payease.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Document(collection = "payment_gateway_transactions")
public class PaymentGatewayTransaction {

    @Id
    private String id;

    // Payment Identifiers
    private String invoiceNumber;
    private String paymentId;
    private String urn;
    private String rrn;
    private String transactionId;
    private String authCode;
    private String actionCode;

    // Customer Details
    private String customerName;
    private String mobile;
    private String email;

    // Payment Information
    private String paymentMode;      // CARD / UPI / NETBANKING
    private String paymentType;      // CREDIT / DEBIT
    private String gateway;          // RAZORPAY / CASHFREE / ICICI

    // Merchant Information
    private String merchantName;
    private String terminalNumber;

    // Account Details (UPI ID / Card masked / Account number)
    private String accountDetails;

    // Financial Details
    private BigDecimal transactionAmount;
    private BigDecimal charge;

    // Commission Breakdown
    private BigDecimal distributorCommission;
    private BigDecimal agentCommission;
    private BigDecimal platformCommission;

    // Amount after commission deduction
    private BigDecimal transferAmount;

    // Currency
    private String transactionCurrency;

    // Payment Status
    private String status;           // PENDING / SUCCESS / FAILED
    private String errorMessage;

    // Date Information
    private String saleDateTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}




















//public class PaymentGatewayDetails {
//
//    @Id
//    private String id;
//
//    private String invoiceNumber;
//    private String transactionAmount;
//    private String transactionCurrency;
//    private String siRegistrationId;
//    private String rrn;
//    private String transactionId;
//    private String authCode;
//    private String actionCode;
//    private String merchantName;
//    private String terminalNumber;
//    private String saleDateTime;
//    private String errorMessage;
//    private String status;
//
//    private String paymentId;
//    private String urn;
//    private String customerName;
//    private String mobile;
//    private String email;
//    private String paymentType;
//    private String paymentMode;
//    private String gateway;
//    private String accountDetails;
//    private Double charge;
//    private Double transferAmount;
//    private Double distributorCommission;
//    private Double agentCommission;
//    private Double platformCommission;
//
//}
