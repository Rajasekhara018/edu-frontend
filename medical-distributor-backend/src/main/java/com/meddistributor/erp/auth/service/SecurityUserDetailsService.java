package com.meddistributor.erp.auth.service;

import com.meddistributor.erp.auth.entity.User;
import com.meddistributor.erp.auth.entity.UserStatus;
import com.meddistributor.erp.auth.repository.UserRepository;
import java.util.stream.Collectors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SecurityUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  public SecurityUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    boolean enabled = user.getStatus() == UserStatus.ACTIVE;
    return org.springframework.security.core.userdetails.User.builder()
        .username(user.getUsername())
        .password(user.getPasswordHash())
        .authorities(user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toSet()))
        .accountExpired(false)
        .accountLocked(!enabled)
        .credentialsExpired(false)
        .disabled(!enabled)
        .build();
  }
}
