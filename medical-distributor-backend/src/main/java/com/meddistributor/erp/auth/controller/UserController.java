package com.meddistributor.erp.auth.controller;

import com.meddistributor.erp.auth.dto.UserRequest;
import com.meddistributor.erp.auth.dto.UserResponse;
import com.meddistributor.erp.auth.dto.UserStatusRequest;
import com.meddistributor.erp.auth.entity.UserStatus;
import com.meddistributor.erp.auth.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @PostMapping
  public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
    return ResponseEntity.ok(userService.createUser(request));
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @GetMapping
  public ResponseEntity<List<UserResponse>> list() {
    return ResponseEntity.ok(userService.listUsers());
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @GetMapping("/{id}")
  public ResponseEntity<UserResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(userService.getUser(id));
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @PutMapping("/{id}")
  public ResponseEntity<UserResponse> update(@PathVariable UUID id, @Valid @RequestBody UserRequest request) {
    return ResponseEntity.ok(userService.updateUser(id, request));
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @PatchMapping("/{id}/status")
  public ResponseEntity<Void> updateStatus(@PathVariable UUID id, @Valid @RequestBody UserStatusRequest request) {
    userService.updateStatus(id, UserStatus.valueOf(request.getStatus()));
    return ResponseEntity.noContent().build();
  }
}
