package com.payease.app.dao;

import com.payease.app.helper.RequestObject;
import com.payease.app.model.PaymentGatewayTransaction;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.regex.Pattern;

@Repository
public class PaymentGatewayTransactionDao extends GenericDao<PaymentGatewayTransaction> {

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

    /**
     * Dynamic search with filters
     */
    public List<PaymentGatewayTransaction> findByData(RequestObject request) {
        Query query = new Query();
        if (request.getFilters() != null) {
            request.getFilters().forEach((key, value) -> {
                if (value != null) {
                    String regexValue = ".*" + value.toString() + ".*";
                    query.addCriteria(Criteria.where(key).regex(regexValue, "i"));
                }
            });
        }
        return mongoTemplate.find(query, getEntityClass());
    }

    /**
     * Find by URN
     */
    public PaymentGatewayTransaction findByUrn(String urn) {
        Query query = new Query();
        query.addCriteria(Criteria.where("urn").is(urn));
        return mongoTemplate.findOne(query, getEntityClass());

    }

    /**
     * Find by PaymentId
     */
    public PaymentGatewayTransaction findByPaymentId(String paymentId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("paymentId").is(paymentId));
        return mongoTemplate.findOne(query, getEntityClass());
    }

    /**
     * Find by RRN
     */
    public PaymentGatewayTransaction findByRrn(String rrn) {
        Query query = new Query();
        query.addCriteria(Criteria.where("rrn").is(rrn));
        return mongoTemplate.findOne(query, getEntityClass());

    }

    /**
     * Find by TransactionId
     */
    public PaymentGatewayTransaction findByTransactionId(String transactionId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("transactionId").is(transactionId));
        return mongoTemplate.findOne(query, getEntityClass());

    }

    /**
     * Case insensitive search for email
     */
    public PaymentGatewayTransaction findByEmailIgnoreCase(String email) {
        Query query = new Query();
        query.addCriteria(Criteria.where("email").regex("^" + Pattern.quote(email) + "$", "i"));
        return mongoTemplate.findOne(query, getEntityClass());
    }

}