package com.meddistributor.erp.auth.service;

import com.meddistributor.erp.auth.dto.RoleRequest;
import com.meddistributor.erp.auth.dto.RoleResponse;
import com.meddistributor.erp.auth.entity.Permission;
import com.meddistributor.erp.auth.entity.Role;
import com.meddistributor.erp.auth.repository.PermissionRepository;
import com.meddistributor.erp.auth.repository.RoleRepository;
import com.meddistributor.erp.common.exception.BusinessException;
import com.meddistributor.erp.common.exception.NotFoundException;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleService {
  private final RoleRepository roleRepository;
  private final PermissionRepository permissionRepository;

  public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
    this.roleRepository = roleRepository;
    this.permissionRepository = permissionRepository;
  }

  @Transactional
  public RoleResponse create(RoleRequest request) {
    if (roleRepository.findByName(request.getName()).isPresent()) {
      throw new BusinessException("Role already exists", HttpStatus.CONFLICT);
    }
    Role role = new Role();
    role.setName(request.getName());
    role.setDescription(request.getDescription());
    role.setPermissions(resolvePermissions(request.getPermissions()));
    return toResponse(roleRepository.save(role));
  }

  public List<RoleResponse> list() {
    return roleRepository.findAll().stream().map(this::toResponse).toList();
  }

  public RoleResponse get(UUID id) {
    return toResponse(roleRepository.findById(id).orElseThrow(() -> new NotFoundException("Role not found")));
  }

  @Transactional
  public RoleResponse update(UUID id, RoleRequest request) {
    Role role = roleRepository.findById(id).orElseThrow(() -> new NotFoundException("Role not found"));
    role.setDescription(request.getDescription());
    role.setPermissions(resolvePermissions(request.getPermissions()));
    return toResponse(roleRepository.save(role));
  }

  private Set<Permission> resolvePermissions(Set<String> codes) {
    if (codes == null || codes.isEmpty()) {
      return Set.of();
    }
    return codes.stream()
        .map(code -> permissionRepository.findByCode(code)
            .orElseThrow(() -> new NotFoundException("Permission not found: " + code)))
        .collect(Collectors.toSet());
  }

  private RoleResponse toResponse(Role role) {
    return RoleResponse.builder()
        .id(role.getId())
        .name(role.getName())
        .description(role.getDescription())
        .permissions(role.getPermissions().stream().map(Permission::getCode).collect(Collectors.toSet()))
        .build();
  }
}
