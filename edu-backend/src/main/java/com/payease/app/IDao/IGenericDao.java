package com.payease.app.IDao;

import org.springframework.data.domain.Page;

import com.payease.app.helper.RequestObject;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

public interface IGenericDao<T> {

	T create(T data);
	
	T fineOne(String data);

	Class<T> getEntityClass();
	
	Page<T> getAll(RequestObject requestObjO);
	
	T update(T data);

	List<T> getAll();

	List<T> findByField(String fieldName, Object value);

	List<T> find(Query query);
	
}
