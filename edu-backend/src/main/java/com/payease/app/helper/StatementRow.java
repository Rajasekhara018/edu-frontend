package com.payease.app.helper;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class StatementRow {
    private String urn;
    private String paymentId;
    private String name;
    private String mobile;
    private String paymentMode;
    private String gateway;
    private BigDecimal amount;
    private BigDecimal distributorCommission;
    private BigDecimal agentCommission;
    private BigDecimal platformCommission;
    private BigDecimal transferAmount;
    private LocalDateTime paymentDate;
}