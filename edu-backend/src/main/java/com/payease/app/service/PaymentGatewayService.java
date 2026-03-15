package com.payease.app.service;

import com.payease.app.dao.PaymentGatewayTransactionDao;
import com.payease.app.helper.CommissionResult;
import com.payease.app.helper.CreatePaymentRequest;
import com.payease.app.helper.PaymentMethodCommission;
import com.payease.app.helper.RequestObject;
import com.payease.app.model.PaymentGatewayTransaction;
import com.payease.app.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static com.payease.app.utility.UrnGenerator.generateURN;

@Service
public class PaymentGatewayService {

    @Autowired
    CommissionSettingService commissionSettingService;

    @Autowired
    PaymentGatewayTransactionDao paymentDao;

    public PaymentGatewayTransaction createPayment(CreatePaymentRequest request) {
        PaymentGatewayTransaction payment = new PaymentGatewayTransaction();
        // Customer details
        payment.setCustomerName(request.getCustomerName());
        payment.setMobile(request.getCustomerMobileNo());
        payment.setEmail(request.getCustomerEmailId());
        // Payment details
        payment.setPaymentMode(request.getPaymentMode());
        payment.setPaymentType(request.getPaymentType());
        payment.setGateway(request.getGateway());
        // Transaction details
        payment.setInvoiceNumber(request.getOrderId());
        payment.setTransactionAmount(request.getAmount());
        payment.setUrn(generateURN());
        payment.setStatus("PENDING");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        // Fetch commission rule
        PaymentMethodCommission rule = commissionSettingService.getCommissionRule(request.getGateway(), request.getPaymentMode(), request.getPaymentType());
        if (rule == null) {
            throw new RuntimeException("Commission rule not configured for Gateway: " + request.getGateway() + ", Mode: " + request.getPaymentMode() + ", Type: " + request.getPaymentType());
        }
        // Calculate commissions
        CommissionResult commission = commissionSettingService.calculateCommission(request.getAmount(), rule);
        payment.setDistributorCommission(commission.getDistributorCommission());
        payment.setAgentCommission(commission.getAgentCommission());
        payment.setPlatformCommission(commission.getPlatformCommission());
        // Calculate transfer amount safely using BigDecimal
        BigDecimal transferAmount = request.getAmount().subtract(commission.getDistributorCommission()).subtract(commission.getAgentCommission()).subtract(commission.getPlatformCommission());
        payment.setTransferAmount(transferAmount);
        return paymentDao.create(payment);
    }

    public PaymentGatewayTransaction findOne(String id) {
        return paymentDao.fineOne(id);
    }

    public Page<PaymentGatewayTransaction> getAll(RequestObject requestObj) {
        return paymentDao.getAll(requestObj);
    }
}
