package com.payease.app.dao;

import java.util.List;

import com.payease.app.model.PaymentGatewayTransaction;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class PaymentGatewayDao extends GenericDao<PaymentGatewayTransaction> {

    @Override
    public Class<PaymentGatewayTransaction> getEntityClass() {
        return PaymentGatewayTransaction.class;
    }

    @Override
    public List<PaymentGatewayTransaction> findByField(String fieldName, Object value) {
        Query query = new Query();
        query.addCriteria(Criteria.where(fieldName).is(value));
        return mongoTemplate.find(query, getEntityClass());
    }

    @Override
    public List<PaymentGatewayTransaction> find(Query query) {
        return mongoTemplate.find(query, getEntityClass());
    }

    public PaymentGatewayTransaction findByInvoiceNumber(String invoiceNumber) {
        Query query = new Query();
        query.addCriteria(Criteria.where("invoiceNumber").is(invoiceNumber));
        return mongoTemplate.findOne(query, getEntityClass());
    }

}
