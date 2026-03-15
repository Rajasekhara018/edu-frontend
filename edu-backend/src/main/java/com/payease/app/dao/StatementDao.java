package com.payease.app.dao;

import com.payease.app.model.PaymentGatewayTransaction;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class StatementDao extends GenericDao<PaymentGatewayTransaction> {

    @Override
    public Class<PaymentGatewayTransaction> getEntityClass() {
        return PaymentGatewayTransaction.class;
    }

    @Override
    public List<PaymentGatewayTransaction> findByField(String fieldName, Object value) {
        return List.of();
    }

    @Override
    public List<PaymentGatewayTransaction> find(Query query) {
        return List.of();
    }

    public List<PaymentGatewayTransaction> findStatementTransactions(LocalDateTime start, LocalDateTime end, String reference) {
        Query query = new Query();
        query.addCriteria(Criteria.where("saleDateTime").gte(start).lte(end));
        query.addCriteria(Criteria.where("status").is("SUCCESS"));
        if (reference != null) {
            query.addCriteria(new Criteria().orOperator(Criteria.where("urn").regex(reference, "i"), Criteria.where("paymentId").regex(reference, "i"), Criteria.where("mobile").regex(reference, "i")));
        }
        return mongoTemplate.find(query, getEntityClass());
    }
}
