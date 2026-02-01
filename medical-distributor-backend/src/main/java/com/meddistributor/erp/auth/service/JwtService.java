package com.meddistributor.erp.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final JwtProperties properties;
  private final Key signingKey;

  public JwtService(JwtProperties properties) {
    this.properties = properties;
    this.signingKey = Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8));
  }

  public String generateAccessToken(String username, List<String> roles) {
    Instant now = Instant.now();
    Instant expiresAt = now.plusSeconds(properties.getAccessTokenTtlMinutes() * 60);
    return Jwts.builder()
        .id(UUID.randomUUID().toString())
        .subject(username)
        .issuer(properties.getIssuer())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiresAt))
        .claim("roles", roles)
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public String generateRefreshToken(String username) {
    Instant now = Instant.now();
    Instant expiresAt = now.plusSeconds(properties.getRefreshTokenTtlDays() * 86400);
    return Jwts.builder()
        .id(UUID.randomUUID().toString())
        .subject(username)
        .issuer(properties.getIssuer())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiresAt))
        .signWith(signingKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(signingKey)
        .requireIssuer(properties.getIssuer())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  public boolean isTokenValid(String token) {
    try {
      parseClaims(token);
      return true;
    } catch (Exception ex) {
      return false;
    }
  }
}
