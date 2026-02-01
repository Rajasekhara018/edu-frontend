package com.meddistributor.erp.common.exception;

import com.meddistributor.erp.common.dto.ApiError;
import com.meddistributor.erp.common.config.CorrelationIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ApiError> handleBusiness(BusinessException ex, HttpServletRequest request) {
    ApiError error = ApiError.builder()
        .timestamp(Instant.now())
        .status(ex.getStatus().value())
        .error(ex.getStatus().getReasonPhrase())
        .message(ex.getMessage())
        .path(request.getRequestURI())
        .correlationId(MDC.get(CorrelationIdFilter.MDC_KEY))
        .build();
    return ResponseEntity.status(ex.getStatus()).body(error);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
    List<String> details = ex.getBindingResult().getAllErrors().stream()
        .map(error -> {
          if (error instanceof FieldError fieldError) {
            return fieldError.getField() + ": " + fieldError.getDefaultMessage();
          }
          return error.getDefaultMessage();
        })
        .collect(Collectors.toList());
    ApiError error = ApiError.builder()
        .timestamp(Instant.now())
        .status(HttpStatus.BAD_REQUEST.value())
        .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
        .message("Validation failed")
        .details(details)
        .path(request.getRequestURI())
        .correlationId(MDC.get(CorrelationIdFilter.MDC_KEY))
        .build();
    return ResponseEntity.badRequest().body(error);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
    ApiError error = ApiError.builder()
        .timestamp(Instant.now())
        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
        .message("Unexpected error")
        .details(List.of(ex.getMessage()))
        .path(request.getRequestURI())
        .correlationId(MDC.get(CorrelationIdFilter.MDC_KEY))
        .build();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
  }
}
