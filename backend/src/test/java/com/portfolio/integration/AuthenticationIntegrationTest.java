package com.portfolio.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.auth.dto.LoginRequest;
import com.portfolio.auth.dto.LoginResponse;
import com.portfolio.user.entity.User;
import com.portfolio.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Create test user
        User user = User.builder()
                .username("testadmin")
                .passwordHash(passwordEncoder.encode("testpassword"))
                .role("admin")
                .build();
        userRepository.save(user);
    }

    @Test
    void shouldAuthenticateAndAccessProtectedEndpoint() throws Exception {
        // Step 1: Login and get JWT token
        LoginRequest loginRequest = new LoginRequest("testadmin", "testpassword");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.username").value("testadmin"))
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        LoginResponse loginResponse = objectMapper.readValue(responseBody, LoginResponse.class);
        String token = loginResponse.getToken();

        assertNotNull(token);
        assertTrue(token.length() > 0);

        // Step 2: Access public endpoint without token
        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk());

        // Step 3: Try to access protected endpoint without token
        mockMvc.perform(post("/api/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\",\"category\":\"test\",\"proficiency\":50}"))
                .andExpect(status().isUnauthorized());

        // Step 4: Access protected endpoint with valid token
        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Docker\",\"category\":\"devops\",\"proficiency\":85,\"icon\":\"fa-brands fa-docker\",\"sortOrder\":1}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Docker"))
                .andExpect(jsonPath("$.category").value("devops"));
    }

    @Test
    void shouldRejectInvalidCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest("testadmin", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRejectInvalidToken() throws Exception {
        String invalidToken = "invalid.jwt.token";

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + invalidToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test\",\"category\":\"test\",\"proficiency\":50}"))
                .andExpect(status().isUnauthorized());
    }
}
