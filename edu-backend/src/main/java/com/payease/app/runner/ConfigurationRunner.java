package com.payease.app.runner;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;

import com.payease.app.IDao.IGenericDao;
import com.payease.app.constants.EnumHelper.UserRole;
import com.payease.app.constants.EnumHelper.UserStatus;
import com.payease.app.model.User;
import com.payease.app.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class ConfigurationRunner implements ApplicationRunner {

	@Autowired
	IGenericDao<User> genericDao;

	@Autowired
	UserService userService;

	@Override
	public void run(ApplicationArguments args) throws Exception {
		User adminUser = userService.findOne("adminuser");
		if (adminUser == null) {
			adminUser = new User();
			adminUser.setId("adminuser");
			adminUser.setBusinessName("adminbusiness");
			adminUser.setFullName("Srikanth Reddy");
			adminUser.setEmailId("srikanthreddyj8179@gmail.com");
			adminUser.setPhNo("8179110896");
			adminUser.setUserName("adminuser");
			adminUser.setPassword(this.computeSHA512("Srikanth@123"));
			adminUser.setStatus(UserStatus.ACTIVE);
			log.info("password...................{}", this.computeSHA512("Srikanth@123"));
			adminUser.setAdminUser(true);
			log.info("adminUser...................{}", adminUser);
//			User user =   userService.create(adminUser);
			adminUser.setUserName(this.getAlphaNumericString(12));
			adminUser.setId(adminUser.getUserName());
			genericDao.create(adminUser);
			log.info("adminUser 2 ...................{}", adminUser);
		}
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
}
