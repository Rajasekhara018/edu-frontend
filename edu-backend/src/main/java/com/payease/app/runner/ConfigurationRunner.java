package com.payease.app.runner;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.payease.app.IDao.IGenericDao;
import com.payease.app.constants.EnumHelper.UserStatus;
import com.payease.app.dao.UserDao;
import com.payease.app.model.User;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class ConfigurationRunner implements ApplicationRunner {

	@Autowired
	IGenericDao<User> genericDao;

	@Autowired
	UserDao userDao;

	@Autowired
	Environment environment;

	@Override
	public void run(ApplicationArguments args) throws Exception {
		final String activeProfile = resolveActiveProfile();
		final String defaultAdminUserName = environment.getRequiredProperty("app.bootstrap.admin.username");
		final String defaultAdminEmail = environment.getRequiredProperty("app.bootstrap.admin.email");
		User adminUser = userDao.findByUserName(defaultAdminUserName);
		if (adminUser == null) {
			adminUser = new User();
			adminUser.setId(defaultAdminUserName);
			adminUser.setBusinessName("Edu Payments Platform");
			adminUser.setFullName("System Administrator");
			adminUser.setEmailId(defaultAdminEmail);
			adminUser.setUserName(defaultAdminUserName);
			adminUser.setPassword(this.computeSHA512("ChangeMe@123"));
			adminUser.setForcePasswordChange(true);
			adminUser.setStatus(UserStatus.ACTIVE);
			adminUser.setAdminUser(true);
			adminUser.setDistributeUser(false);
			adminUser.setRetailUser(false);
			genericDao.create(adminUser);
			log.info("Default admin user created with username {}", defaultAdminUserName);
		} else {
			log.info("Default admin user already exists with username {}", defaultAdminUserName);
		}
	}

	private String resolveActiveProfile() {
		String[] activeProfiles = environment.getActiveProfiles();
		if (activeProfiles.length > 0) {
			return activeProfiles[0].toLowerCase();
		}
		return "dev";
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
