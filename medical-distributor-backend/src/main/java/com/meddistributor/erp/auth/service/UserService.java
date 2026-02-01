package com.meddistributor.erp.auth.service;

import com.meddistributor.erp.auth.dto.UserRequest;
import com.meddistributor.erp.auth.dto.UserResponse;
import com.meddistributor.erp.auth.entity.Role;
import com.meddistributor.erp.auth.entity.User;
import com.meddistributor.erp.auth.entity.UserStatus;
import com.meddistributor.erp.auth.repository.RoleRepository;
import com.meddistributor.erp.auth.repository.UserRepository;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.common.exception.NotFoundException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public UserResponse createUser(UserRequest request) {
    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
      throw new BusinessException("Username already exists", HttpStatus.CONFLICT);
    }
    if (request.getPassword() == null || request.getPassword().isBlank()) {
      throw new BusinessException("Password is required", HttpStatus.BAD_REQUEST);
    }
    User user = new User();
    user.setUsername(request.getUsername());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setTerritory(request.getTerritory());
    user.setBranchCode(request.getBranchCode());
    user.setStatus(UserStatus.ACTIVE);
    user.setRoles(resolveRoles(request.getRoles()));
    return toResponse(userRepository.save(user));
  }

  public List<UserResponse> listUsers() {
    return userRepository.findAll().stream().map(this::toResponse).toList();
  }

  public UserResponse getUser(UUID id) {
    return toResponse(userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found")));
  }

  @Transactional
  public UserResponse updateUser(UUID id, UserRequest request) {
    User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    user.setFullName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setTerritory(request.getTerritory());
    user.setBranchCode(request.getBranchCode());
    if (request.getPassword() != null && !request.getPassword().isBlank()) {
      user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    }
    user.setRoles(resolveRoles(request.getRoles()));
    return toResponse(userRepository.save(user));
  }

  @Transactional
  public void updateStatus(UUID id, UserStatus status) {
    User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    user.setStatus(status);
    userRepository.save(user);
  }

  private Set<Role> resolveRoles(Set<String> roleNames) {
    return roleNames.stream()
        .map(name -> roleRepository.findByName(name)
            .orElseThrow(() -> new NotFoundException("Role not found: " + name)))
        .collect(Collectors.toSet());
  }

  private UserResponse toResponse(User user) {
    return UserResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .fullName(user.getFullName())
        .email(user.getEmail())
        .territory(user.getTerritory())
        .branchCode(user.getBranchCode())
        .status(user.getStatus().name())
        .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
        .build();
  }
}
