package com.payease.app.helper;

import java.util.Map;

import lombok.Data;

@Data
public class RequestObject {
	private String reqType;
	private Map<String, Object> filters;
	private String key;
	private Object object;
	private Integer page;
	private Integer size;
}
