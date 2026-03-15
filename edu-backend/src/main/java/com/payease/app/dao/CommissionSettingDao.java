package com.payease.app.dao;

import java.util.List;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.payease.app.helper.RequestObject;
import com.payease.app.model.CommissionSetting;

@Repository
public class CommissionSettingDao extends GenericDao<CommissionSetting> {

    @Override
    public Class<CommissionSetting> getEntityClass() {
        return CommissionSetting.class;
    }

    @Override
    public List<CommissionSetting> findByField(String fieldName, Object value) {
        Query query = new Query();
        query.addCriteria(Criteria.where(fieldName).is(value));
        return mongoTemplate.find(query, getEntityClass());
    }

    @Override
    public List<CommissionSetting> find(Query query) {
        return mongoTemplate.find(query, getEntityClass());
    }

    public CommissionSetting findByGateway(String gateway) {
        Query query = new Query();
        query.addCriteria(Criteria.where("gateway").is(gateway));
        return mongoTemplate.findOne(query, getEntityClass());
    }

    public List<CommissionSetting> findByData(RequestObject request) {
        Query query = new Query();
        if (request.getFilters() != null) {
            request.getFilters().forEach((key, value) -> {
                if (value != null) {
                    query.addCriteria(Criteria.where(key).regex(".*" + value + ".*", "i"));
                }
            });
        }
        return mongoTemplate.find(query, getEntityClass());
    }
}
