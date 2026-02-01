package com.meddistributor.erp.auth.controller;

import com.meddistributor.erp.auth.dto.PermissionRequest;
import com.meddistributor.erp.auth.dto.PermissionResponse;
import com.meddistributor.erp.auth.service.PermissionService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/permissions")
public class PermissionController {
  private final PermissionService permissionService;

  public PermissionController(PermissionService permissionService) {
    this.permissionService = permissionService;
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @PostMapping
  public ResponseEntity<PermissionResponse> create(@Valid @RequestBody PermissionRequest request) {
    return ResponseEntity.ok(permissionService.create(request));
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @GetMapping
  public ResponseEntity<List<PermissionResponse>> list() {
    return ResponseEntity.ok(permissionService.list());
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @GetMapping("/{id}")
  public ResponseEntity<PermissionResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(permissionService.get(id));
  }
}
