package com.payease.app.helper;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentCallbackRequest {

    private String rrn;
    private String transactionId;
    private String authCode;
    private String actionCode;
    private String invoiceNumber;
    private String errorMessage;
    private String transactionAmount;
    private String transactionCurrency;
    private String merchantName;
    private String terminalNumber;
    private String saleDateTime;
    private String siRegistrationId;
}