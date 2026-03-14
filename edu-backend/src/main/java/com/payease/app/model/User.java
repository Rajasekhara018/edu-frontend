package com.payease.app.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.payease.app.constants.EnumHelper.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {

	@Id
	private String id;

	private String fullName;

	private List<String> courseName;

	private String businessName;

	private String emailId;

	private String phNo;

	private String userName;

	private String password;

	private String oldPassword;

	private Boolean forcePasswordChange;

	private String aadharNo;

	private String panName;

	private String panNo;

	private String dateOfBirth;

	private String address;

	private String businessAddress;

	private Boolean adminUser;

	private Boolean distributeUser;

	private Boolean retailUser;

	private String distributeId;

	private String profilePicLocation;

	private String plainPassword;

	private String applicationId;

	private String resetPasswordToken;

	private Long resetPasswordTokenExpiry;

	private UserStatus status;
	private String retailerAccountDetails;
	private String distributorAccountDetails;

}
