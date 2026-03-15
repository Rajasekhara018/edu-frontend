package com.payease.app.helper;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentMethodCommission {
    private String paymentMode;   // CARD, UPI, NETBANKING
    private String paymentType;   // VISA, MASTERCARD, IMPS, RTGS (optional)
    private BigDecimal distributorPercent;
    private BigDecimal agentPercent;
    private BigDecimal platformPercent;
}
