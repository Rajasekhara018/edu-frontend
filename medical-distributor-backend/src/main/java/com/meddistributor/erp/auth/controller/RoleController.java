package com.meddistributor.erp.auth.controller;

import com.meddistributor.erp.auth.dto.RoleRequest;
import com.meddistributor.erp.auth.dto.RoleResponse;
import com.meddistributor.erp.auth.service.RoleService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/roles")
public class RoleController {
  private final RoleService roleService;

  public RoleController(RoleService roleService) {
    this.roleService = roleService;
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @PostMapping
  public ResponseEntity<RoleResponse> create(@Valid @RequestBody RoleRequest request) {
    return ResponseEntity.ok(roleService.create(request));
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @GetMapping
  public ResponseEntity<List<RoleResponse>> list() {
    return ResponseEntity.ok(roleService.list());
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @GetMapping("/{id}")
  public ResponseEntity<RoleResponse> get(@PathVariable UUID id) {
    return ResponseEntity.ok(roleService.get(id));
  }

  @PreAuthorize("hasRole('SUPER_ADMIN')")
  @PutMapping("/{id}")
  public ResponseEntity<RoleResponse> update(@PathVariable UUID id, @Valid @RequestBody RoleRequest request) {
    return ResponseEntity.ok(roleService.update(id, request));
  }
}
