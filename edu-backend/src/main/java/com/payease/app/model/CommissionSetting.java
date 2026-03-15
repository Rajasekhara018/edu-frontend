package com.payease.app.model;

import com.payease.app.helper.PaymentMethodCommission;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "commission_settings")
public class CommissionSetting {
    @Id
    private String id;

    private String gateway;   // YUGMA, RAZORPAY, PAYU

    private List<PaymentMethodCommission> paymentMethods;
}
