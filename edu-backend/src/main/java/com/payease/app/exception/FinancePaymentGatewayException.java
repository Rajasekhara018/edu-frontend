package com.payease.app.exception;

public class FinancePaymentGatewayException extends Exception {

    public FinancePaymentGatewayException(String message) {
        super(message);
    }

    public FinancePaymentGatewayException(String message, Throwable cause) {
        super(message, cause);
    }
}
