package com.payease.app.helper;

import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
public class Address {

	@Field("UA1")
	private String village;
	
	@Field("UA2")
	private String district;
	
	@Field("UA3")
	private String state;
	
}
