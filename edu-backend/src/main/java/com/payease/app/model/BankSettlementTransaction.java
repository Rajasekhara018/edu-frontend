package com.payease.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "bank_settlement_transactions")
public class BankSettlementTransaction {

    @Id
    private String id;

    private String paymentId;
    private String urn;

    private String customerName;
    private String mobile;

    private String accountDetails;

    private String paymentMode; // IMPS / RTGS / NEFT

    private Double transactionAmount;
    private Double charge;
    private Double transferAmount;

    private String bankReferenceId;

    private String saleDateTime;
    private String status;

}
