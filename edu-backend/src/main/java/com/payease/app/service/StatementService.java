package com.payease.app.service;

import com.payease.app.dao.StatementDao;
import com.payease.app.helper.StatementResponse;
import com.payease.app.helper.StatementRow;
import com.payease.app.helper.StatementSummary;
import com.payease.app.model.PaymentGatewayTransaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class StatementService {

    @Autowired
    private StatementDao statementDao;

    public StatementResponse generateStatement(LocalDateTime startDate, LocalDateTime endDate, String reference) {
        List<PaymentGatewayTransaction> transactions = statementDao.findStatementTransactions(startDate, endDate, reference);
        List<StatementRow> rows = new ArrayList<>();
        StatementSummary summary = new StatementSummary();
        for (PaymentGatewayTransaction txn : transactions) {
            StatementRow row = new StatementRow();
            row.setUrn(txn.getUrn());
            row.setPaymentId(txn.getPaymentId());
            row.setName(txn.getCustomerName());
            row.setMobile(txn.getMobile());
            row.setPaymentMode(txn.getPaymentMode());
            row.setGateway(txn.getGateway());
            row.setAmount(txn.getTransactionAmount());
            row.setDistributorCommission(txn.getDistributorCommission());
            row.setAgentCommission(txn.getAgentCommission());
            row.setPlatformCommission(txn.getPlatformCommission());
            row.setTransferAmount(txn.getTransferAmount());
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            row.setPaymentDate(LocalDateTime.parse(txn.getSaleDateTime(), formatter));
            rows.add(row);
            summary.setTotalTransactions(summary.getTotalTransactions() + 1);
            summary.setTotalTransactionAmount(summary.getTotalTransactionAmount().add(txn.getTransactionAmount()));
            summary.setTotalDistributorCommission(summary.getTotalDistributorCommission().add(txn.getDistributorCommission()));
            summary.setTotalAgentCommission(summary.getTotalAgentCommission().add(txn.getAgentCommission()));
            summary.setTotalPlatformCommission(summary.getTotalPlatformCommission().add(txn.getPlatformCommission()));
            summary.setTotalTransferAmount(summary.getTotalTransferAmount().add(txn.getTransferAmount()));
        }
        StatementResponse response = new StatementResponse();
        response.setRows(rows);
        response.setSummary(summary);
        return response;
    }
}
