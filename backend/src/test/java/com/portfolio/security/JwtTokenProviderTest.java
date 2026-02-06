package com.portfolio.security;

import com.portfolio.config.JwtConfig;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private JwtConfig jwtConfig;

    @BeforeEach
    void setUp() {
        jwtConfig = new JwtConfig();
        jwtConfig.setSecret("testSecretKeyForJWT123456789012345678901234567890");
        jwtConfig.setExpiration(3600000L); // 1 hour
        jwtTokenProvider = new JwtTokenProvider(jwtConfig);
    }

    @Test
    void shouldGenerateTokenSuccessfully() {
        User user = new User("testuser", "password",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_admin")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        String token = jwtTokenProvider.generateToken(authentication);

        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void shouldExtractUsernameFromToken() {
        User user = new User("testuser", "password",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_admin")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String token = jwtTokenProvider.generateToken(authentication);

        String username = jwtTokenProvider.getUsernameFromToken(token);

        assertEquals("testuser", username);
    }

    @Test
    void shouldValidateTokenSuccessfully() {
        User user = new User("testuser", "password",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_admin")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String token = jwtTokenProvider.generateToken(authentication);

        boolean isValid = jwtTokenProvider.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    void shouldReturnFalseForInvalidToken() {
        String invalidToken = "invalid.token.here";

        boolean isValid = jwtTokenProvider.validateToken(invalidToken);

        assertFalse(isValid);
    }

    @Test
    void shouldReturnFalseForExpiredToken() {
        jwtConfig.setExpiration(1L); // 1 millisecond
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(jwtConfig);

        User user = new User("testuser", "password",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_admin")));
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String token = shortLivedProvider.generateToken(authentication);

        try {
            Thread.sleep(10); // Wait for token to expire
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        boolean isValid = shortLivedProvider.validateToken(token);

        assertFalse(isValid);
    }
}
