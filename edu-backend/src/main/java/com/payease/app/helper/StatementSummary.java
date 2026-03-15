package com.payease.app.helper;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class StatementSummary {

    private BigDecimal totalTransactionAmount = BigDecimal.ZERO;
    private BigDecimal totalDistributorCommission = BigDecimal.ZERO;
    private BigDecimal totalAgentCommission = BigDecimal.ZERO;
    private BigDecimal totalPlatformCommission = BigDecimal.ZERO;
    private BigDecimal totalTransferAmount = BigDecimal.ZERO;

    private Long totalTransactions = 0L;
}
