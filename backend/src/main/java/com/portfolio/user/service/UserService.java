package com.portfolio.user.service;

import com.portfolio.user.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface UserService extends UserDetailsService {
    Optional<User> findByUsername(String username);
    User save(User user);
    User changePassword(String username, String currentPassword, String newPassword) throws Exception;
}
