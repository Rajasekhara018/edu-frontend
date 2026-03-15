package com.payease.app.controller;

import com.payease.app.constants.EduBackendConstants;
import com.payease.app.exception.FinancePaymentGatewayException;
import com.payease.app.helper.PaymentRequestParams;
import com.payease.app.model.PaymentGatewayTransaction;
import com.payease.app.service.PaymentCallbackService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment/callback")
@CrossOrigin("*")
@Slf4j
public class PaymentCallbackController {

    private final PaymentCallbackService paymentCallbackService;
    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    public PaymentCallbackController(PaymentCallbackService paymentGatewayService) {
        this.paymentCallbackService = paymentGatewayService;
    }


    @PostMapping(value = "/transsucc", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Void> transactionSuccess(@RequestParam MultiValueMap<String, String> req, HttpServletRequest httpReq) throws FinancePaymentGatewayException {
        PaymentGatewayTransaction details = buildPaymentDetails(req);
        details.setStatus("SUCCESS");
        log.info("Payment SUCCESS callback received. invoice={}, rrn={}", details.getInvoiceNumber(), details.getRrn());
        paymentCallbackService.processSuccessPayment(details);
        URI redirectUri = UriComponentsBuilder.fromUriString(frontendBaseUrl + EduBackendConstants.TRANSACTION_SUCCESS_API).queryParam("amt", details.getTransactionAmount()).queryParam("transactionId", details.getInvoiceNumber()).queryParam("terminalId", details.getTerminalNumber()).queryParam("rrn", details.getRrn()).build().toUri();
        return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();
    }


    @PostMapping(value = "/transfail", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Void> transactionFailure(@RequestParam MultiValueMap<String, String> req, HttpServletRequest httpReq) throws FinancePaymentGatewayException {
        PaymentGatewayTransaction details = buildPaymentDetails(req);
        details.setStatus("FAILED");
        log.info("Payment FAILURE callback received. invoice={}, rrn={}", details.getInvoiceNumber(), details.getRrn());
        paymentCallbackService.processFailedPayment(details);
        URI redirectUri = UriComponentsBuilder.fromUriString(frontendBaseUrl + EduBackendConstants.TRANSACTION_FAILURE_API).queryParam("amt", details.getTransactionAmount()).queryParam("transactionId", details.getInvoiceNumber()).queryParam("terminalId", details.getTerminalNumber()).queryParam("rrn", details.getRrn()).build().toUri();
        return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();
    }


    private PaymentGatewayTransaction buildPaymentDetails(MultiValueMap<String, String> req) {
        PaymentGatewayTransaction details = new PaymentGatewayTransaction();
        details.setInvoiceNumber(getValue(req, PaymentRequestParams.INVOICE_NUMBER));
        details.setTransactionAmount(BigDecimal.valueOf(getDoubleValue(req, PaymentRequestParams.AMOUNT)));
        details.setTransactionCurrency(getValue(req, PaymentRequestParams.CURRENCY));
//        details.setSiRegistrationId(getValue(req, PaymentRequestParams.SI_REG_ID));
        details.setRrn(getValue(req, PaymentRequestParams.RRN));
        details.setTransactionId(getValue(req, PaymentRequestParams.TXN_ID));
        details.setAuthCode(getValue(req, PaymentRequestParams.AUTH_CODE));
        details.setActionCode(getValue(req, PaymentRequestParams.ACTION_CODE));
        details.setMerchantName(getValue(req, PaymentRequestParams.MERCHANT_NAME));
        details.setTerminalNumber(getValue(req, PaymentRequestParams.TERMINAL));
        details.setSaleDateTime(getValue(req, PaymentRequestParams.SALE_TIME));
        details.setErrorMessage(getValue(req, PaymentRequestParams.ERROR_MESSAGE));
        return details;
    }


    private String getValue(MultiValueMap<String, String> req, String key) {
        return Optional.ofNullable(req.getFirst(key)).orElse("");
    }

    private Double getDoubleValue(MultiValueMap<String, String> req, String key) {
        return Optional.ofNullable(req.getFirst(key)).filter(v -> !v.isBlank()).map(Double::parseDouble).orElse(0.0);
    }
}