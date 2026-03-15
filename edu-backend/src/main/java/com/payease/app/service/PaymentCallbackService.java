package com.payease.app.service;

import com.payease.app.dao.PaymentCallbackDao;
import com.payease.app.exception.FinancePaymentGatewayException;
import com.payease.app.model.PaymentGatewayTransaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PaymentCallbackService {

    private final PaymentCallbackDao paymentGatewayDao;

    public PaymentCallbackService(PaymentCallbackDao paymentGatewayDao) {
        this.paymentGatewayDao = paymentGatewayDao;
    }

    public void processSuccessPayment(PaymentGatewayTransaction dto)
            throws FinancePaymentGatewayException {
        validate(dto);
        PaymentGatewayTransaction existing =
                paymentGatewayDao.findByInvoiceNumber(dto.getInvoiceNumber());
        if (existing == null) {
            throw new FinancePaymentGatewayException(
                    "Payment not found for invoice " + dto.getInvoiceNumber());
        }
        if ("SUCCESS".equals(existing.getStatus())) {
            log.warn("Payment already processed for invoice {}", dto.getInvoiceNumber());
            return;
        }
        existing.setRrn(dto.getRrn());
        existing.setTransactionId(dto.getTransactionId());
        existing.setAuthCode(dto.getAuthCode());
        existing.setActionCode(dto.getActionCode());
        existing.setMerchantName(dto.getMerchantName());
        existing.setTerminalNumber(dto.getTerminalNumber());
        existing.setSaleDateTime(dto.getSaleDateTime());
        existing.setStatus("SUCCESS");
        paymentGatewayDao.update(existing);
        log.info("Payment success processed for invoice {}", dto.getInvoiceNumber());
    }

    public void processFailedPayment(PaymentGatewayTransaction dto)
            throws FinancePaymentGatewayException {
        validate(dto);
        PaymentGatewayTransaction existing =
                paymentGatewayDao.findByInvoiceNumber(dto.getInvoiceNumber());
        if (existing == null) {
            throw new FinancePaymentGatewayException(
                    "Payment not found for invoice " + dto.getInvoiceNumber());
        }
        existing.setErrorMessage(dto.getErrorMessage());
        existing.setStatus("FAILED");
        paymentGatewayDao.update(existing);
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