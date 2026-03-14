package com.payease.app.dao;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.payease.app.helper.RequestObject;
import com.payease.app.model.User;

@Repository
public class UserDao extends GenericDao<User> {

	@Override
	public Class<User> getEntityClass() {
		return User.class;
	}
	@Override
	public List<User> findByField(String fieldName, Object value) {
		Query query = new Query();
		query.addCriteria(Criteria.where(fieldName).is(value));
		return mongoTemplate.find(query, getEntityClass());
	}

	@Override
	public List<User> find(Query query) {
		return mongoTemplate.find(query, getEntityClass());
	}

	public List<User> findByData(RequestObject request) {
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

	public User findByUserName(String userName) {
		Query query = new Query();
		query.addCriteria(Criteria.where("userName").is(userName));
		return mongoTemplate.findOne(query, getEntityClass());
	}

	public User findByEmailId(String emailId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("emailId").is(emailId));
		return mongoTemplate.findOne(query, getEntityClass());
	}

	public User findByEmailIdIgnoreCase(String emailId) {
		Query query = new Query();
		query.addCriteria(Criteria.where("emailId").regex("^" + Pattern.quote(emailId) + "$", "i"));
		return mongoTemplate.findOne(query, getEntityClass());
	}

	public User findByResetPasswordToken(String token) {
		Query query = new Query();
		query.addCriteria(Criteria.where("resetPasswordToken").is(token));
		return mongoTemplate.findOne(query, getEntityClass());
	}
}
