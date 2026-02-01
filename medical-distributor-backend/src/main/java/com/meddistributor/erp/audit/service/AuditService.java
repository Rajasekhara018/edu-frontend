package com.meddistributor.erp.audit.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.meddistributor.erp.audit.entity.AuditLog;
import com.meddistributor.erp.audit.repository.AuditLogRepository;
import com.meddistributor.erp.auth.repository.UserRepository;
import com.meddistributor.erp.common.config.CorrelationIdFilter;
import com.meddistributor.erp.common.util.SecurityUtil;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
  private final AuditLogRepository auditLogRepository;
  private final UserRepository userRepository;
  private final ObjectMapper objectMapper;

  public AuditService(AuditLogRepository auditLogRepository, UserRepository userRepository, ObjectMapper objectMapper) {
    this.auditLogRepository = auditLogRepository;
    this.userRepository = userRepository;
    this.objectMapper = objectMapper;
  }

  public void logChange(String entityType, UUID entityId, String action, Object before, Object after) {
    AuditLog log = new AuditLog();
    log.setId(UUID.randomUUID());
    log.setEntityType(entityType);
    log.setEntityId(entityId);
    log.setAction(action);
    log.setBeforeData(toJson(before));
    log.setAfterData(toJson(after));
    log.setCorrelationId(MDC.get(CorrelationIdFilter.MDC_KEY));
    log.setCreatedAt(Instant.now());
    String username = SecurityUtil.currentUsername();
    if (username != null) {
      userRepository.findByUsername(username).ifPresent(user -> log.setUserId(user.getId()));
    }
    auditLogRepository.save(log);
  }

  private String toJson(Object obj) {
    if (obj == null) {
      return null;
    }
    try {
      return objectMapper.writeValueAsString(obj);
    } catch (JsonProcessingException ex) {
      return null;
    }
  }
}
