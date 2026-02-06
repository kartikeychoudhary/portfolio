package com.portfolio.user.repository;

import com.portfolio.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindUserByUsername() {
        User user = User.builder()
                .username("testuser")
                .passwordHash("hashedpassword")
                .role("admin")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        Optional<User> found = userRepository.findByUsername("testuser");

        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }

    @Test
    void shouldReturnEmptyWhenUsernameNotFound() {
        Optional<User> found = userRepository.findByUsername("nonexistent");

        assertFalse(found.isPresent());
    }

    @Test
    void shouldCheckIfUsernameExists() {
        User user = User.builder()
                .username("testuser")
                .passwordHash("hashedpassword")
                .role("admin")
                .build();
        entityManager.persist(user);
        entityManager.flush();

        boolean exists = userRepository.existsByUsername("testuser");

        assertTrue(exists);
    }

    @Test
    void shouldReturnFalseWhenUsernameDoesNotExist() {
        boolean exists = userRepository.existsByUsername("nonexistent");

        assertFalse(exists);
    }
}
