package com.payease.app.exception;

import com.payease.app.helper.ResponseObject;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CommissionAlreadyExistsException.class)
    public ResponseObject handleCommissionExists(CommissionAlreadyExistsException ex) {
        ResponseObject response = new ResponseObject();
        response.setStatus(false);
        response.setErrorMsg(ex.getMessage());
        return response;
    }

    @ExceptionHandler(Exception.class)
    public ResponseObject handleGenericException(Exception ex) {
        ResponseObject response = new ResponseObject();
        response.setStatus(false);
        response.setErrorMsg("Something went wrong");
        return response;
    }
}
