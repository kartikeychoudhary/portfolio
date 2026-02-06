package com.portfolio.profile.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.profile.dto.ProfileDto;
import com.portfolio.profile.dto.SocialLinkDto;
import com.portfolio.profile.service.ProfileService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfileController.class)
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfileService profileService;

    @Test
    void shouldGetProfileWithoutAuthentication() throws Exception {
        ProfileDto profile = ProfileDto.builder()
                .id("1")
                .fullName("John Doe")
                .title("Full Stack Developer")
                .email("john@example.com")
                .phone("+1234567890")
                .location("New York, USA")
                .socialLinks(Arrays.asList(
                    SocialLinkDto.builder()
                        .id("1")
                        .platform("GitHub")
                        .url("https://github.com/johndoe")
                        .icon("fa-brands fa-github")
                        .sortOrder(1)
                        .build()
                ))
                .build();

        when(profileService.getProfile()).thenReturn(profile);

        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.fullName").value("John Doe"))
                .andExpect(jsonPath("$.title").value("Full Stack Developer"))
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.socialLinks[0].platform").value("GitHub"));

        verify(profileService).getProfile();
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldUpdateProfileWithAdminRole() throws Exception {
        ProfileDto profileDto = ProfileDto.builder()
                .fullName("John Doe Updated")
                .title("Senior Developer")
                .email("john.updated@example.com")
                .build();

        ProfileDto updatedProfile = ProfileDto.builder()
                .id("1")
                .fullName("John Doe Updated")
                .title("Senior Developer")
                .email("john.updated@example.com")
                .build();

        when(profileService.updateProfile(any(ProfileDto.class))).thenReturn(updatedProfile);

        mockMvc.perform(put("/api/profile")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("John Doe Updated"))
                .andExpect(jsonPath("$.title").value("Senior Developer"));

        verify(profileService).updateProfile(any(ProfileDto.class));
    }

    @Test
    void shouldReturn401WhenUpdatingProfileWithoutAuth() throws Exception {
        ProfileDto profileDto = ProfileDto.builder()
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .build();

        mockMvc.perform(put("/api/profile")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileDto)))
                .andExpect(status().isUnauthorized());

        verify(profileService, never()).updateProfile(any(ProfileDto.class));
    }
}
