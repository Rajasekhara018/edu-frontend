package com.payease.app.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import com.payease.app.IDao.IGenericDao;
import com.payease.app.helper.RequestObject;

public abstract class GenericDao<T> implements IGenericDao<T> {

	@Autowired
	MongoTemplate mongoTemplate;

	public T create(T data) {
		return mongoTemplate.insert(data);

	}

	public T fineOne(String id) {
		return (T) mongoTemplate.findById(id, getEntityClass());

	}

	public List<T> getAll() {
		return mongoTemplate.findAll(getEntityClass());
	}

	public Page<T> getAll(RequestObject requestObj) {
    int page = requestObj.getPage() != null ? requestObj.getPage() : 0;
    int size = requestObj.getSize() != null ? requestObj.getSize() : 10;
    Pageable pageable = PageRequest.of(page, size);
    // Create query with pagination
    Query query = new Query().with(pageable);
    // Fetch content
    List<T> content = mongoTemplate.find(query, getEntityClass());
    // Get total count
    long total = mongoTemplate.count(new Query(), getEntityClass());
    return new PageImpl<>(content, pageable, total);
   }

	public T update(T data) {
		return mongoTemplate.save(data);

	}
}
