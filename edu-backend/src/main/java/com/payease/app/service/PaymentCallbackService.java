package com.payease.app.service;

import com.payease.app.dao.PaymentGatewayDao;
import com.payease.app.exception.FinancePaymentGatewayException;
import com.payease.app.model.PaymentGatewayTransaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PaymentGatewayService {

    private final PaymentGatewayDao paymentGatewayDao;

    public PaymentGatewayService(PaymentGatewayDao paymentGatewayDao) {
        this.paymentGatewayDao = paymentGatewayDao;
    }

    public void processSuccessPayment(PaymentGatewayTransaction dto) throws FinancePaymentGatewayException {
        validate(dto);
        PaymentGatewayTransaction existing = paymentGatewayDao.findByInvoiceNumber(dto.getInvoiceNumber());
        if (existing != null) {
            log.warn("Payment already processed for invoice {}", dto.getInvoiceNumber());
            return;
        }
        PaymentGatewayTransaction entity = map(dto);
        entity.setStatus("SUCCESS");
        paymentGatewayDao.create(entity);
        log.info("Payment success processed for invoice {}", dto.getInvoiceNumber());
    }

    public void processFailedPayment(PaymentGatewayTransaction dto) throws FinancePaymentGatewayException {
        validate(dto);
        PaymentGatewayTransaction entity = map(dto);
        entity.setStatus("FAILED");
        paymentGatewayDao.create(entity);
        log.info("Payment failure processed for invoice {}", dto.getInvoiceNumber());
    }

    private void validate(PaymentGatewayTransaction dto) throws FinancePaymentGatewayException {
        if (dto.getInvoiceNumber() == null || dto.getInvoiceNumber().isBlank()) {
            throw new FinancePaymentGatewayException("Invoice number missing");
        }
        if (dto.getTransactionAmount() == null) {
            throw new FinancePaymentGatewayException("Transaction amount missing");
        }
    }

    private PaymentGatewayTransaction map(PaymentGatewayTransaction dto) {
        PaymentGatewayTransaction entity = new PaymentGatewayTransaction();
        entity.setInvoiceNumber(dto.getInvoiceNumber());
        entity.setTransactionAmount(dto.getTransactionAmount());
        entity.setTransactionCurrency(dto.getTransactionCurrency());
//        entity.setSiRegistrationId(dto.getSiRegistrationId());
        entity.setRrn(dto.getRrn());
        entity.setTransactionId(dto.getTransactionId());
        entity.setAuthCode(dto.getAuthCode());
        entity.setActionCode(dto.getActionCode());
        entity.setMerchantName(dto.getMerchantName());
        entity.setTerminalNumber(dto.getTerminalNumber());
        entity.setSaleDateTime(dto.getSaleDateTime());
        entity.setErrorMessage(dto.getErrorMessage());
        return entity;
    }
}