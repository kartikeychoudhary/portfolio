package com.portfolio.user.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void shouldGenerateIdOnPrePersist() {
        User user = new User();
        user.setUsername("testuser");
        user.setPasswordHash("hashedpassword");
        user.setRole("admin");

        user.prePersist();

        assertNotNull(user.getId());
        assertTrue(user.getId().length() == 36); // UUID length
    }

    @Test
    void shouldSetTimestampsOnPrePersist() {
        User user = new User();
        user.setUsername("testuser");
        user.setPasswordHash("hashedpassword");
        user.setRole("admin");

        user.prePersist();

        assertNotNull(user.getCreatedAt());
        assertNotNull(user.getUpdatedAt());
    }
}
