package com.meddistributor.erp.auth.service;

import com.meddistributor.erp.auth.dto.AuthResponse;
import com.meddistributor.erp.auth.dto.LoginRequest;
import com.meddistributor.erp.auth.dto.RefreshRequest;
import com.meddistributor.erp.auth.entity.RefreshToken;
import com.meddistributor.erp.auth.entity.User;
import com.meddistributor.erp.auth.repository.RefreshTokenRepository;
import com.meddistributor.erp.auth.repository.UserRepository;
import com.meddistributor.erp.common.exception.BusinessException;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final JwtService jwtService;
  private final JwtProperties jwtProperties;
  private final PasswordEncoder passwordEncoder;

  public AuthService(AuthenticationManager authenticationManager,
                     UserRepository userRepository,
                     RefreshTokenRepository refreshTokenRepository,
                     JwtService jwtService,
                     JwtProperties jwtProperties,
                     PasswordEncoder passwordEncoder) {
    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.jwtService = jwtService;
    this.jwtProperties = jwtProperties;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public AuthResponse login(LoginRequest request) {
    Authentication auth = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
    if (!auth.isAuthenticated()) {
      throw new BusinessException("Invalid credentials", HttpStatus.UNAUTHORIZED);
    }
    User user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new BusinessException("User not found", HttpStatus.UNAUTHORIZED));
    String accessToken = jwtService.generateAccessToken(user.getUsername(),
        user.getRoles().stream().map(role -> role.getName()).toList());
    String refreshTokenValue = jwtService.generateRefreshToken(user.getUsername());
    RefreshToken refreshToken = new RefreshToken();
    refreshToken.setToken(refreshTokenValue);
    refreshToken.setUser(user);
    refreshToken.setExpiresAt(Instant.now().plusSeconds(jwtProperties.getRefreshTokenTtlDays() * 86400));
    refreshTokenRepository.save(refreshToken);
    return AuthResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshTokenValue)
        .expiresInSeconds(jwtProperties.getAccessTokenTtlMinutes() * 60)
        .build();
  }

  @Transactional
  public AuthResponse refresh(RefreshRequest request) {
    RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
        .orElseThrow(() -> new BusinessException("Invalid refresh token", HttpStatus.UNAUTHORIZED));
    if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(Instant.now())) {
      throw new BusinessException("Refresh token expired", HttpStatus.UNAUTHORIZED);
    }
    if (!jwtService.isTokenValid(refreshToken.getToken())) {
      throw new BusinessException("Refresh token invalid", HttpStatus.UNAUTHORIZED);
    }
    User user = refreshToken.getUser();
    refreshToken.setRevoked(true);
    refreshTokenRepository.save(refreshToken);
    String newRefreshTokenValue = jwtService.generateRefreshToken(user.getUsername());
    RefreshToken newRefreshToken = new RefreshToken();
    newRefreshToken.setToken(newRefreshTokenValue);
    newRefreshToken.setUser(user);
    newRefreshToken.setExpiresAt(Instant.now().plusSeconds(jwtProperties.getRefreshTokenTtlDays() * 86400));
    refreshTokenRepository.save(newRefreshToken);
    String accessToken = jwtService.generateAccessToken(user.getUsername(),
        user.getRoles().stream().map(role -> role.getName()).toList());
    return AuthResponse.builder()
        .accessToken(accessToken)
        .refreshToken(newRefreshTokenValue)
        .expiresInSeconds(jwtProperties.getAccessTokenTtlMinutes() * 60)
        .build();
  }

  public boolean checkPassword(String raw, String hashed) {
    return passwordEncoder.matches(raw, hashed);
  }
}
