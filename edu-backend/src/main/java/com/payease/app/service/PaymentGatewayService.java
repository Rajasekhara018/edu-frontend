package com.payease.app.service;

import com.payease.app.dao.PaymentGatewayTransactionDao;
import com.payease.app.helper.CommissionResult;
import com.payease.app.helper.CreatePaymentRequest;
import com.payease.app.helper.PaymentMethodCommission;
import com.payease.app.helper.RequestObject;
import com.payease.app.model.PaymentGatewayTransaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static com.payease.app.utility.UrnGenerator.generateURN;

@Service
public class PaymentGatewayService {

    @Autowired
    MongoTemplate mongoTemplate;

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

    public Map<String, Object> getTodayMetrics() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(23,59,59);
        MatchOperation match = Aggregation.match(
                Criteria.where("saleDateTime").regex("^" + today)
        );
        GroupOperation group = Aggregation.group()
                .sum("transactionAmount").as("todayVolume")
                .count().as("totalTransactions")
                .sum(
                        ConditionalOperators.when(
                                Criteria.where("status").is("SUCCESS")
                        ).then(1).otherwise(0)
                ).as("successCount");
        Aggregation aggregation = Aggregation.newAggregation(match, group);
        AggregationResults<Document> result =
                mongoTemplate.aggregate(aggregation, "gateway_transaction", Document.class);
        Document doc = result.getUniqueMappedResult();
        Number totalTransactions =
                doc == null ? 0 : (Number) doc.getOrDefault("totalTransactions", 0);
        Number successCount =
                doc == null ? 0 : (Number) doc.getOrDefault("successCount", 0);
        Number todayVolume =
                doc == null ? 0 : (Number) doc.getOrDefault("todayVolume", 0);
        double settlementHealth =
                totalTransactions.longValue() == 0
                        ? 0
                        : (successCount.longValue() * 100.0) / totalTransactions.longValue();
        Map<String, Object> response = new HashMap<>();
        response.put("todayVolume", todayVolume.doubleValue());
        response.put("settlementHealth", Math.round(settlementHealth));
        response.put("totalTransactions", totalTransactions.longValue());
        return response;
    }
}
