package com.payease.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "payment_gateway_transactions")
public class PaymentGatewayDetails {

    @Id
    private String id;

    private String invoiceNumber;
    private String transactionAmount;
    private String transactionCurrency;
    private String siRegistrationId;
    private String rrn;
    private String transactionId;
    private String authCode;
    private String actionCode;
    private String merchantName;
    private String terminalNumber;
    private String saleDateTime;
    private String errorMessage;
    private String status;

    private String paymentId;
    private String urn;
    private String customerName;
    private String mobile;
    private String email;
    private String paymentType;
    private String paymentMode;
    private String gateway;
    private String accountDetails;
    private Double charge;
    private Double transferAmount;
    private Double distributorCommission;
    private Double agentCommission;
    private Double platformCommission;

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
