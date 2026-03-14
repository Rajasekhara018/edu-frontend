package com.payease.app.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import com.payease.app.IDao.IGenericDao;
import com.payease.app.constants.EnumHelper.UserStatus;
import com.payease.app.dao.UserDao;
import com.payease.app.helper.RequestObject;
import com.payease.app.helper.ResponseObject;
import com.payease.app.model.User;

@Service("userService")
public class UserService {

	private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

	@Autowired
	IGenericDao<User> genericDao;

	@Autowired
	UserDao userDao;
	@Autowired
	EmailService emailService;

	@Value("${app.frontend.base-url}")
	private String frontendBaseUrl;

	@Value("${spring.profiles.active:}")
	private String activeProfile;

	private static final long RESET_TOKEN_VALIDITY_MILLIS = 30 * 60 * 1000L;

	public User create(User user) {
		String randomPass;
		try {
			randomPass = this.getAlphaNumericString(9);
			System.out.println("-----" + randomPass);
			user.setPlainPassword(randomPass);
			user.setPassword(this.computeSHA512(randomPass));
			user.setForcePasswordChange(true);
			user.setUserName(this.getAlphaNumericString(12));
			user.setId(user.getUserName());
			user.setStatus(UserStatus.ACTIVE);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		User result = genericDao.create(user);
		if (result != null) {
			try {
				emailService.sendRegistrationCredentialsEmail(
						user.getEmailId(),
						user.getFullName(),
						user.getUserName(),
						randomPass);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return result;
	}

	public User findOne(String id) {
		return genericDao.fineOne(id);
	}

	public Page<User> getAll(RequestObject requestObj) {
		return genericDao.getAll(requestObj);
	}

	public User update(User data) {
		return genericDao.update(data);
	}

	public List<User> findByData(RequestObject data) {
		return userDao.findByData(data);
	}

	private String getAlphaNumericString(int n) {
		String alphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "0123456789" + "abcdefghijklmnopqrstuvwxyz";
		StringBuilder sb = new StringBuilder(n);
		SecureRandom random = new SecureRandom();
		for (int i = 0; i < n; i++) {
			int index = random.nextInt(alphaNumericString.length());
			sb.append(alphaNumericString.charAt(index));
		}
		return sb.toString();
	}

	private String computeSHA512(String data) throws Exception {
		MessageDigest digest = MessageDigest.getInstance("SHA-512");
		byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
		StringBuilder sb = new StringBuilder();
		for (byte b : hash) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();
	}

	public ResponseObject signupUser(User user) {
		ResponseObject responseObject = new ResponseObject();
		if (Boolean.TRUE.equals(user.getDistributeUser())) {
//			user.setDistributeId(this.getAlphaNumericString(8));
		}
		String randomPass;
		try {
			randomPass = this.getAlphaNumericString(9);
			System.out.println("randompass :" + randomPass);
			user.setPlainPassword(randomPass);
			user.setUserName(this.getAlphaNumericString(12));
			user.setPassword(this.computeSHA512(randomPass));
			user.setForcePasswordChange(true);
			user.setDistributeUser(true);
			user.setId(user.getUserName());
			user.setStatus(UserStatus.PENDING);
		} catch (Exception e) {
			responseObject.setStatus(false);
			responseObject.setErrorMsg("Password encryption failed.");
			return responseObject;
		}
		User result = userDao.create(user);
		if (result == null) {
			responseObject.setObject(null);
			responseObject.setStatus(false);
			responseObject.setErrorMsg("User creation failed in database.");
			return responseObject;
		}
		try {
			emailService.sendPendingApprovalEmail(user.getEmailId(), user.getFullName());
			responseObject.setErrorMsg("User registration completed successfully. Your account is pending admin approval.");
		} catch (Exception e) {
			responseObject.setErrorMsg("User registration completed, but the pending approval email could not be sent.");
		}
		responseObject.setObject(result);
		responseObject.setStatus(true);
		return responseObject;
	}

	public ResponseObject signinUser(User user) {
		ResponseObject response = new ResponseObject();
		if (user.getUserName() == null || user.getPassword() == null) {
			return buildErrorResponse("Username and password must not be empty");
		}
		User existingUser = userDao.findByUserName(user.getUserName());
		if (existingUser == null) {
			return buildErrorResponse("User not found with the provided username");
		}
		try {
//			String encryptedInputPassword = computeSHA512(user.getPassword());
			if (!existingUser.getPassword().equals(user.getPassword())) {
				return buildErrorResponse("Incorrect username or password");
			}
		} catch (Exception e) {
			return buildErrorResponse("Password processing failed");
		}
		if (existingUser.getStatus() == UserStatus.PENDING) {
			return buildErrorResponse("Your account is pending admin approval.");
		}
		if (existingUser.getStatus() == UserStatus.INACTIVE || existingUser.getStatus() == UserStatus.SUSPENDED) {
			return buildErrorResponse("Your account is not active. Please contact the administrator.");
		}
		response.setStatus(true);
		response.setObject(existingUser);
		response.setErrorMsg("Welcome! You have logged in successfully.");
		return response;
	}

	public ResponseObject changePassword(User user) {
		if (user == null || user.getUserName() == null || user.getOldPassword() == null || user.getPassword() == null) {
			return buildErrorResponse("Username, current password, and new password must not be empty");
		}

		User existingUser = userDao.findByUserName(user.getUserName());
		if (existingUser == null) {
			return buildErrorResponse("User not found with the provided username");
		}

		if (!existingUser.getPassword().equals(user.getOldPassword())) {
			return buildErrorResponse("Current password is incorrect");
		}

		if (existingUser.getPassword().equals(user.getPassword())) {
			return buildErrorResponse("New password must be different from the current password");
		}

		existingUser.setPassword(user.getPassword());
		existingUser.setOldPassword(null);
		existingUser.setPlainPassword(null);
		existingUser.setForcePasswordChange(false);

		User updatedUser = userDao.update(existingUser);
		if (updatedUser == null) {
			return buildErrorResponse("Password update failed");
		}

		ResponseObject response = new ResponseObject();
		response.setStatus(true);
		response.setObject(updatedUser);
		response.setErrorMsg("Password changed successfully.");
		return response;
	}

	public ResponseObject forgotPassword(User user) {
		ResponseObject response = new ResponseObject();
		response.setStatus(true);
		response.setObject(null);
		response.setErrorMsg("If an account exists for that email address, password reset instructions have been sent.");
		boolean matched = false;
		boolean emailSent = false;
		if (user == null || (!StringUtils.hasText(user.getEmailId()) && !StringUtils.hasText(user.getUserName()))) {
			LOGGER.info("Forgot-password request received without a usable emailId or userName.");
			attachForgotPasswordDebug(response, null, null, matched, emailSent, null);
			return response;
		}
		String normalizedEmail = normalizeIdentifier(user.getEmailId());
		String normalizedUserName = normalizeIdentifier(user.getUserName());
		User existingUser = null;
		if (StringUtils.hasText(normalizedEmail)) {
			existingUser = userDao.findByEmailIdIgnoreCase(normalizedEmail);
		}
		if (existingUser == null && StringUtils.hasText(normalizedUserName)) {
			existingUser = userDao.findByUserName(normalizedUserName);
		}
		if (existingUser == null) {
			LOGGER.info("Forgot-password request did not match any user. emailId='{}', userName='{}'",
					normalizedEmail, normalizedUserName);
			attachForgotPasswordDebug(response, normalizedEmail, normalizedUserName, matched, emailSent, null);
			return response;
		}
		matched = true;
		LOGGER.info("Forgot-password request matched userId='{}' for emailId='{}', userName='{}'",
				existingUser.getId(), normalizedEmail, normalizedUserName);
		existingUser.setResetPasswordToken(UUID.randomUUID().toString());
		existingUser.setResetPasswordTokenExpiry(System.currentTimeMillis() + RESET_TOKEN_VALIDITY_MILLIS);
		userDao.update(existingUser);
		try {
			emailService.sendPasswordResetEmail(
					existingUser.getEmailId(),
					existingUser.getFullName(),
					buildPasswordResetLink(existingUser.getResetPasswordToken()));
			emailSent = true;
		} catch (Exception e) {
			return buildErrorResponse("Password reset email could not be sent.");
		}
		attachForgotPasswordDebug(response, normalizedEmail, normalizedUserName, matched, emailSent, existingUser.getId());
		return response;
	}

	public ResponseObject resetPassword(User user) {
		ResponseObject response = new ResponseObject();
		boolean tokenMatched = false;
		boolean tokenExpired = false;
		boolean passwordUpdated = false;
		String normalizedToken = user != null ? normalizeToken(user.getResetPasswordToken()) : null;

		if (user == null || !StringUtils.hasText(user.getResetPasswordToken()) || !StringUtils.hasText(user.getPassword())) {
			response = buildErrorResponse("Reset token and new password are required.");
			attachResetPasswordDebug(response, normalizedToken, tokenMatched, tokenExpired, passwordUpdated, null);
			return response;
		}

		User existingUser = userDao.findByResetPasswordToken(normalizedToken);
		if (existingUser == null) {
			response = buildErrorResponse("This password reset link is invalid.");
			attachResetPasswordDebug(response, normalizedToken, tokenMatched, tokenExpired, passwordUpdated, null);
			return response;
		}

		tokenMatched = true;

		if (existingUser.getResetPasswordTokenExpiry() == null
				|| existingUser.getResetPasswordTokenExpiry() < System.currentTimeMillis()) {
			tokenExpired = true;
			response = buildErrorResponse("This password reset link has expired.");
			attachResetPasswordDebug(response, normalizedToken, tokenMatched, tokenExpired, passwordUpdated, existingUser.getId());
			return response;
		}

		if (user.getPassword().equals(existingUser.getPassword())) {
			response = buildErrorResponse("New password must be different from the current password.");
			attachResetPasswordDebug(response, normalizedToken, tokenMatched, tokenExpired, passwordUpdated, existingUser.getId());
			return response;
		}

		existingUser.setPassword(user.getPassword());
		existingUser.setPlainPassword(null);
		existingUser.setOldPassword(null);
		existingUser.setForcePasswordChange(false);
		existingUser.setResetPasswordToken(null);
		existingUser.setResetPasswordTokenExpiry(null);

		User updatedUser = userDao.update(existingUser);
		if (updatedUser == null) {
			response = buildErrorResponse("Password reset failed.");
			attachResetPasswordDebug(response, normalizedToken, tokenMatched, tokenExpired, passwordUpdated, existingUser.getId());
			return response;
		}

		passwordUpdated = true;
		response.setStatus(true);
		response.setObject(updatedUser);
		response.setErrorMsg("Password has been reset successfully.");
		attachResetPasswordDebug(response, normalizedToken, tokenMatched, tokenExpired, passwordUpdated, updatedUser.getId());
		return response;
	}

	private ResponseObject buildErrorResponse(String message) {
		ResponseObject response = new ResponseObject();
		response.setStatus(false);
		response.setErrorMsg(message);
		response.setObject(null);
		return response;
	}

	private String buildPasswordResetLink(String token) {
		String normalizedBaseUrl = frontendBaseUrl.endsWith("/") ? frontendBaseUrl.substring(0, frontendBaseUrl.length() - 1)
				: frontendBaseUrl;
		return normalizedBaseUrl + "/auth/reset-password?token=" + token;
	}

	private String normalizeIdentifier(String value) {
		if (!StringUtils.hasText(value)) {
			return null;
		}
		return value.trim().toLowerCase();
	}

	private String normalizeToken(String token) {
		if (!StringUtils.hasText(token)) {
			return null;
		}
		return token.trim();
	}

	private void attachForgotPasswordDebug(ResponseObject response, String normalizedEmail, String normalizedUserName,
			boolean matched, boolean emailSent, String userId) {
		if (!isDevProfile()) {
			return;
		}
		Map<String, Object> debug = new LinkedHashMap<>();
		debug.put("matched", matched);
		debug.put("emailSent", emailSent);
		debug.put("normalizedEmailId", normalizedEmail);
		debug.put("normalizedUserName", normalizedUserName);
		debug.put("userId", userId);
		response.setObject(debug);
	}

	private boolean isDevProfile() {
		return "dev".equalsIgnoreCase(activeProfile);
	}

	private void attachResetPasswordDebug(ResponseObject response, String normalizedToken, boolean tokenMatched,
			boolean tokenExpired, boolean passwordUpdated, String userId) {
		if (!isDevProfile()) {
			return;
		}

		Map<String, Object> debug = new LinkedHashMap<>();
		debug.put("tokenMatched", tokenMatched);
		debug.put("tokenExpired", tokenExpired);
		debug.put("passwordUpdated", passwordUpdated);
		debug.put("normalizedToken", normalizedToken);
		debug.put("userId", userId);
		response.setObject(debug);
	}

	public ResponseObject approveUser(String userId) {
		if (userId == null || userId.isBlank()) {
			return buildErrorResponse("User id must not be empty");
		}

		User existingUser = userDao.fineOne(userId);
		if (existingUser == null) {
			return buildErrorResponse("User not found");
		}

		existingUser.setStatus(UserStatus.ACTIVE);
		existingUser.setForcePasswordChange(true);
		User updatedUser = userDao.update(existingUser);
		if (updatedUser == null) {
			return buildErrorResponse("User approval failed");
		}
		ResponseObject response = new ResponseObject();
		response.setStatus(true);
		response.setObject(updatedUser);
		try {
			emailService.sendRegistrationCredentialsEmail(
					updatedUser.getEmailId(),
					updatedUser.getFullName(),
					updatedUser.getUserName(),
					updatedUser.getPlainPassword());
			response.setErrorMsg("User approved successfully. Credentials email sent.");
		} catch (Exception e) {
			response.setErrorMsg("User approved successfully, but the credentials email could not be sent.");
		}
		return response;
	}
	public ResponseObject courseSignupUser(User user) {
		ResponseObject responseObject = new ResponseObject();
		if (Boolean.TRUE.equals(user.getDistributeUser())) {
//			user.setDistributeId(this.getAlphaNumericString(8));
		}
		try {
			String randomPass = this.getAlphaNumericString(9);
			System.out.println("randompass :" + randomPass);
			user.setPlainPassword(randomPass);
			user.setUserName(this.getAlphaNumericString(12));
			user.setPassword(this.computeSHA512(randomPass));
			user.setForcePasswordChange(true);
			user.setDistributeUser(true);
			user.setId(user.getUserName());
//			StringBuilder body = new StringBuilder();
//			body.append("Hello ").append(user.getFullName()).append(",\n\n");
//			body.append("Thank you for registering with EduSoft Academy!\n\n");
//			body.append("Here are your Login details:\n");
//			body.append("User Name: ").append(user.getUserName()).append("\n");
//			body.append("Password: ").append(randomPass).append("\n\n");
//			body.append("Registered Courses:\n");
//			for (String course : user.getCourseName()) {
//			    body.append(" - ").append(course).append("\n");
//			}
//			body.append("\nHappy Learning!\n");
//			body.append("EduSoft Academy Team");
			StringBuilder body = new StringBuilder();

			body.append("Dear ").append(user.getFullName()).append(",\n\n");
			body.append("We’re excited to welcome you to ")
			    .append(String.join(", ", user.getCourseName()))
			    .append(", offered by EduSoft Academy.\n");
			body.append("Congratulations on taking this step to invest in your learning journey!\n\n");

			body.append("What Happens Next?\n\n");
			body.append("Course Access: You can now log in to your account at ")
			    .append("http://edusoftacademy.net").append(" using your registered email.\n\n");
			body.append("Course Material: All lessons, videos, and assignments are available in your dashboard.\n\n");
			body.append("Support: Our team is here to help with any queries at support@edusoftacademy.com.\n\n");

			body.append("Learning Tips:\n");
			body.append(" - Set aside dedicated time each week to go through modules.\n");
			body.append(" - Participate actively in discussions and assignments to get the most out of the course.\n");
			body.append(" - Track your progress in your dashboard to stay motivated.\n\n");

			body.append("Certificates:\n");
			body.append("Upon successful completion of the course, you’ll receive a Certificate of Completion, ")
			    .append("which you can share on your resume or LinkedIn profile.\n\n");

			body.append("We’re delighted to have you on board and look forward to seeing you succeed.\n\n");
			body.append("Welcome once again, and happy learning!\n\n");
			body.append("Warm regards,\n");
			body.append("EduSoft Academy");
			emailService.sendSimpleEmail(
				    user.getEmailId(),
				    "Welcome to " + String.join(", ", user.getCourseName()) + " – Let’s Get Started!",
				    body.toString()
				);
		} catch (Exception e) {
			responseObject.setStatus(false);
			responseObject.setErrorMsg("Password encryption failed.");
			return responseObject;
		}
		User result = userDao.create(user);

		if (result != null) {
			responseObject.setObject(result);
			responseObject.setStatus(true);
			responseObject.setErrorMsg("Course registration completed, Mail Sent successfully.");
		} else {
			responseObject.setObject(null);
			responseObject.setStatus(false);
			responseObject.setErrorMsg("User creation failed in database.");
		}
		return responseObject;
	}
}
