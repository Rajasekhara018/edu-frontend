package com.payease.app.IDao;

import org.springframework.data.domain.Page;

import com.payease.app.helper.RequestObject;

public interface IGenericDao<T> {

	T create(T data);
	
	T fineOne(String data);

	Class<T> getEntityClass();
	
	Page<T> getAll(RequestObject requestObjO);
	
	T update(T data);
	
}
