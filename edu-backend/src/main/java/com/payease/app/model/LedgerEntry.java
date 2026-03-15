package com.payease.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "ledger_entries")
public class LedgerEntry {

    @Id
    private String id;

    private String paymentId;
    private String urn;

    private String paymentType; // COMMISSION / PAYMENT / REFUND

    private String customerName;
    private String mobile;

    private String accountDetails;

    private String paymentMode;
    private String gateway;

    private Double transactionAmount;

    private String saleDateTime;

}
