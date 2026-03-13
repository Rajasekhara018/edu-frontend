package com.payease.app.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.payease.app.helper.RequestObject;
import com.payease.app.helper.ResponseObject;
import com.payease.app.model.User;
import com.payease.app.service.UserService;
import com.payease.app.utility.MapperUtility;

@RestController
@RequestMapping("/api/dstuser")
@CrossOrigin("*")
public class UserController {

	@Autowired
	UserService userService;

	@PostMapping("/cre")
	public ResponseObject create(@RequestBody RequestObject request) {
		ResponseObject response = new ResponseObject();
		return Optional.of(request).filter(req -> req.getReqType().equals("CREATE")).map(data -> {
			User user = MapperUtility.buildMapperForIgnoreAnnotation()
					.convertValue(data.getObject(), User.class);
			user = userService.create(user);
			response.setStatus(true);
			response.setObject(user);
			return response;
		}).orElseGet(() -> {
			response.setErrorMsg("invaild req");
			return response;
		});

	}
	
	// @RequestMapping(value = { "/getall" }, method = RequestMethod.POST, consumes = { MediaType.APPLICATION_JSON_VALUE,
	// 		MediaType.APPLICATION_XML_VALUE }, produces = { MediaType.APPLICATION_JSON_VALUE,
	// 				MediaType.APPLICATION_XML_VALUE })
	// public ResponseObject getAll() {
	// 	ResponseObject response = new ResponseObject();
	// 	response.setObject(userService.getAll());
	// 	response.setStatus(true);
	// 	response.setErrorMsg("Users retrieved successfully.");
	// 	return response;
	// }
	@PostMapping("/getall")
	public ResponseObject getAll(@RequestBody RequestObject request) {
		ResponseObject response = new ResponseObject();
		response.setObject(userService.getAll(request));
		response.setStatus(true);
		response.setErrorMsg("Users retrieved successfully.");
		return response;

	}
	
	@RequestMapping(value = { "/filterData" }, method = RequestMethod.POST, consumes = {
			MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }, produces = {
					MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
	public ResponseObject filterData(@RequestBody RequestObject data) {
		ResponseObject response = new ResponseObject();
		response.setObject(userService.findByData(data));
		response.setStatus(true);
		return response;

	}
	
	@RequestMapping(value = { "/inq" }, method = RequestMethod.POST,  produces = {
					MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
	public ResponseObject inquiry(@RequestParam("id") String id) {
		ResponseObject response = new ResponseObject();
		response.setObject(userService.findOne(id));
		response.setStatus(true);
		response.setErrorMsg("User details fetched successfully.");
		return response;
	}
	
	@PostMapping("/upd")
	public ResponseObject update(@RequestBody RequestObject request) {
		ResponseObject response = new ResponseObject();
		return Optional.of(request).filter(req -> req.getReqType().equals("UPDATE")).map(data -> {
			User user = MapperUtility.buildMapperForIgnoreAnnotation()
					.convertValue(data.getObject(), User.class);
			user = userService.update(user);
			response.setStatus(true);
			response.setObject(user);
			response.setErrorMsg("User updated successfully.");
			return response;
		}).orElseGet(() -> {
			response.setErrorMsg("invaild req");
			return response;
		});

	}
}
