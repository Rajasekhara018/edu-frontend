package com.payease.app.helper;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResponseObject {

	private boolean status;

	private Object object;

	private String errorMsg;
	private LocalDateTime timestamp = LocalDateTime.now();
}
