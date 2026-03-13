package com.payease.app.helper;

import lombok.Data;

@Data
public class ResponseObject {

	private boolean status;

	private Object object;

	private String errorMsg;
}
