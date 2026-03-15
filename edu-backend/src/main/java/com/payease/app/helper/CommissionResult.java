package com.payease.app.helper;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CommissionResult {

    private BigDecimal distributorCommission;
    private BigDecimal agentCommission;
    private BigDecimal platformCommission;

}
