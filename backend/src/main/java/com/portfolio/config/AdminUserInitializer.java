package com.portfolio.config;

import com.portfolio.user.entity.User;
import com.portfolio.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Initializes the default admin user at application startup.
 * This ensures an admin user exists for accessing the CMS,
 * regardless of database migration state.
 */
@Component
@Slf4j
public class AdminUserInitializer implements ApplicationRunner {

    private static final String DEFAULT_ADMIN_USERNAME = "admin";
    private static final String DEFAULT_ADMIN_PASSWORD = "admin";
    private static final String DEFAULT_ADMIN_ROLE = "admin";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Check if admin user already exists
        if (userRepository.existsByUsername(DEFAULT_ADMIN_USERNAME)) {
            log.info("Admin user already exists, skipping initialization");
            return;
        }

        log.info("Creating default admin user...");

        // Create admin user
        User adminUser = User.builder()
                .id(UUID.randomUUID().toString())
                .username(DEFAULT_ADMIN_USERNAME)
                .passwordHash(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                .role(DEFAULT_ADMIN_ROLE)
                .requiresPasswordChange(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(adminUser);

        log.info("Default admin user created successfully");
        log.info("Username: {}, Password: {} (CHANGE THIS IMMEDIATELY)",
                DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD);
    }
}
