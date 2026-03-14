package com.payease.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class EduBackendApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(EduBackendApplication.class);
		String activeProfile = System.getProperty("spring.profiles.active");
		if (activeProfile == null || activeProfile.isEmpty()) {
			activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");
		}
		if (activeProfile == null || activeProfile.isEmpty()) {
			app.setAdditionalProfiles("dev");
		}
		app.run(args);
	}
}
