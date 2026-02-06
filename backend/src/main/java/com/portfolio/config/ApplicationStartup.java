package com.portfolio.config;

import com.portfolio.user.entity.User;
import com.portfolio.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Application startup configuration.
 * Initializes default admin user if no users exist in the database.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationStartup {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates default admin user on first application startup.
     * Only runs if the database has no users.
     */
    @Bean
    public CommandLineRunner initializeDefaultUser() {
        return args -> {
            if (userRepository.count() == 0) {
                log.info("No users found in database. Creating default admin user...");

                User admin = User.builder()
                        .username("admin")
                        .passwordHash(passwordEncoder.encode("admin"))
                        .role("admin")
                        .requiresPasswordChange(true)
                        .build();

                userRepository.save(admin);

                log.warn("=================================================");
                log.warn("Default admin user created:");
                log.warn("  Username: admin");
                log.warn("  Password: admin");
                log.warn("  IMPORTANT: Change this password immediately!");
                log.warn("=================================================");
            } else {
                log.info("Users already exist in database. Skipping default user creation.");
            }
        };
    }
}
