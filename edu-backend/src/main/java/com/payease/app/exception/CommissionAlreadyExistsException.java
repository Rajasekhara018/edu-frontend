package com.payease.app.exception;

public class CommissionAlreadyExistsException extends RuntimeException {
    public CommissionAlreadyExistsException(String message) {
        super(message);
    }
}
