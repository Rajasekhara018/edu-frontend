package com.meddistributor.erp.auth.service;

import com.meddistributor.erp.auth.dto.PermissionRequest;
import com.meddistributor.erp.auth.dto.PermissionResponse;
import com.meddistributor.erp.auth.entity.Permission;
import com.meddistributor.erp.auth.repository.PermissionRepository;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.common.exception.NotFoundException;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PermissionService {
  private final PermissionRepository permissionRepository;

  public PermissionService(PermissionRepository permissionRepository) {
    this.permissionRepository = permissionRepository;
  }

  @Transactional
  public PermissionResponse create(PermissionRequest request) {
    if (permissionRepository.findByCode(request.getCode()).isPresent()) {
      throw new BusinessException("Permission already exists", HttpStatus.CONFLICT);
    }
    Permission permission = new Permission();
    permission.setCode(request.getCode());
    permission.setDescription(request.getDescription());
    return toResponse(permissionRepository.save(permission));
  }

  public List<PermissionResponse> list() {
    return permissionRepository.findAll().stream().map(this::toResponse).toList();
  }

  public PermissionResponse get(UUID id) {
    return toResponse(permissionRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Permission not found")));
  }

  private PermissionResponse toResponse(Permission permission) {
    return PermissionResponse.builder()
        .id(permission.getId())
        .code(permission.getCode())
        .description(permission.getDescription())
        .build();
  }
}
