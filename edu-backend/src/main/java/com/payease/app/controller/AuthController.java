package com.payease.app.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.payease.app.helper.RequestObject;
import com.payease.app.helper.ResponseObject;
import com.payease.app.model.User;
import com.payease.app.service.UserService;
import com.payease.app.utility.MapperUtility;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

	@Autowired
	private UserService userService;

	@PostMapping("/signup")
	public ResponseObject register(@RequestBody RequestObject request) {
		return Optional.ofNullable(request).filter(req -> "SIGNUP".equalsIgnoreCase(req.getReqType())).map(data -> {
			User user = MapperUtility.buildMapperForIgnoreAnnotation().convertValue(data.getObject(), User.class);
			return userService.signupUser(user);
		}).orElseGet(() -> {
			ResponseObject response = new ResponseObject();
			response.setStatus(false);
			response.setErrorMsg("Invalid request type. Expected 'SIGNUP'.");
			return response;
		});
	}

	@PostMapping("/signin")
	public ResponseObject signin(@RequestBody RequestObject request) {
		return Optional.ofNullable(request).map(data -> {
			User user = MapperUtility.buildMapperForIgnoreAnnotation().convertValue(data.getObject(), User.class);
			return userService.signinUser(user);
		}).orElseGet(() -> {
			ResponseObject response = new ResponseObject();
			response.setStatus(false);
			response.setErrorMsg("Invalid request type. Expected 'SIGNIN'.");
			return response;
		});
	}

	@PostMapping("/courseSignup")
	public ResponseObject CouseRegister(@RequestBody RequestObject request) {
		return Optional.ofNullable(request).filter(req -> "SIGNUP".equalsIgnoreCase(req.getReqType())).map(data -> {
			User user = MapperUtility.buildMapperForIgnoreAnnotation().convertValue(data.getObject(), User.class);
			return userService.courseSignupUser(user);
		}).orElseGet(() -> {
			ResponseObject response = new ResponseObject();
			response.setStatus(false);
			response.setErrorMsg("Invalid request type. Expected 'SIGNUP'.");
			return response;
		});
	}

	@PostMapping("/change-password")
	public ResponseObject changePassword(@RequestBody RequestObject request) {
		return Optional.ofNullable(request)
				.filter(req -> "CHANGE_PASSWORD".equalsIgnoreCase(req.getReqType()))
				.map(data -> {
					User user = MapperUtility.buildMapperForIgnoreAnnotation().convertValue(data.getObject(),
							User.class);
					return userService.changePassword(user);
				}).orElseGet(() -> {
					ResponseObject response = new ResponseObject();
					response.setStatus(false);
					response.setErrorMsg("Invalid request type. Expected 'CHANGE_PASSWORD'.");
					return response;
				});
	}

	@PostMapping("/forgot-password")
	public ResponseObject forgotPassword(@RequestBody RequestObject request) {
		return Optional.ofNullable(request)
				.filter(req -> "FORGOT_PASSWORD".equalsIgnoreCase(req.getReqType()))
				.map(data -> {
					User user = MapperUtility.buildMapperForIgnoreAnnotation().convertValue(data.getObject(),
							User.class);
					return userService.forgotPassword(user);
				}).orElseGet(() -> {
					ResponseObject response = new ResponseObject();
					response.setStatus(false);
					response.setErrorMsg("Invalid request type. Expected 'FORGOT_PASSWORD'.");
					return response;
				});
	}

	@PostMapping("/reset-password")
	public ResponseObject resetPassword(@RequestBody RequestObject request) {
		return Optional.ofNullable(request)
				.filter(req -> "RESET_PASSWORD".equalsIgnoreCase(req.getReqType()))
				.map(data -> {
					User user = MapperUtility.buildMapperForIgnoreAnnotation().convertValue(data.getObject(),
							User.class);
					return userService.resetPassword(user);
				}).orElseGet(() -> {
					ResponseObject response = new ResponseObject();
					response.setStatus(false);
					response.setErrorMsg("Invalid request type. Expected 'RESET_PASSWORD'.");
					return response;
				});
	}
}
