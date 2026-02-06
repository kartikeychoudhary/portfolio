package com.portfolio.experience.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.experience.dto.ExperienceDto;
import com.portfolio.experience.service.ExperienceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ExperienceController.class)
class ExperienceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ExperienceService experienceService;

    @Test
    void shouldGetAllExperiencesWithoutAuthentication() throws Exception {
        List<ExperienceDto> experiences = Arrays.asList(
                ExperienceDto.builder()
                        .id("1")
                        .company("Company A")
                        .position("Developer")
                        .startDate(LocalDate.of(2020, 1, 1))
                        .technologies(Arrays.asList("Java", "Spring Boot"))
                        .build(),
                ExperienceDto.builder()
                        .id("2")
                        .company("Company B")
                        .position("Senior Developer")
                        .startDate(LocalDate.of(2021, 1, 1))
                        .build()
        );

        when(experienceService.getAllExperiences()).thenReturn(experiences);

        mockMvc.perform(get("/api/experiences"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].company").value("Company A"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].company").value("Company B"));

        verify(experienceService).getAllExperiences();
    }

    @Test
    void shouldGetExperienceById() throws Exception {
        ExperienceDto experience = ExperienceDto.builder()
                .id("1")
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.of(2020, 1, 1))
                .build();

        when(experienceService.getExperienceById("1")).thenReturn(experience);

        mockMvc.perform(get("/api/experiences/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.company").value("Company A"));

        verify(experienceService).getExperienceById("1");
    }

    @Test
    void shouldGetCurrentExperiences() throws Exception {
        List<ExperienceDto> experiences = Arrays.asList(
                ExperienceDto.builder()
                        .id("1")
                        .company("Current Company")
                        .position("Developer")
                        .startDate(LocalDate.of(2023, 1, 1))
                        .build()
        );

        when(experienceService.getCurrentExperiences()).thenReturn(experiences);

        mockMvc.perform(get("/api/experiences/current"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].company").value("Current Company"));

        verify(experienceService).getCurrentExperiences();
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldCreateExperienceWithAdminRole() throws Exception {
        ExperienceDto experienceDto = ExperienceDto.builder()
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.of(2020, 1, 1))
                .technologies(Arrays.asList("Java", "Spring Boot"))
                .sortOrder(1)
                .build();

        ExperienceDto savedExperienceDto = ExperienceDto.builder()
                .id("1")
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.of(2020, 1, 1))
                .technologies(Arrays.asList("Java", "Spring Boot"))
                .sortOrder(1)
                .build();

        when(experienceService.createExperience(any(ExperienceDto.class))).thenReturn(savedExperienceDto);

        mockMvc.perform(post("/api/experiences")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(experienceDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.company").value("Company A"));

        verify(experienceService).createExperience(any(ExperienceDto.class));
    }

    @Test
    void shouldReturn401WhenCreatingExperienceWithoutAuth() throws Exception {
        ExperienceDto experienceDto = ExperienceDto.builder()
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.of(2020, 1, 1))
                .build();

        mockMvc.perform(post("/api/experiences")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(experienceDto)))
                .andExpect(status().isUnauthorized());

        verify(experienceService, never()).createExperience(any(ExperienceDto.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldUpdateExperienceWithAdminRole() throws Exception {
        ExperienceDto experienceDto = ExperienceDto.builder()
                .company("Company A Updated")
                .position("Senior Developer")
                .startDate(LocalDate.of(2020, 1, 1))
                .build();

        ExperienceDto updatedExperienceDto = ExperienceDto.builder()
                .id("1")
                .company("Company A Updated")
                .position("Senior Developer")
                .startDate(LocalDate.of(2020, 1, 1))
                .build();

        when(experienceService.updateExperience(eq("1"), any(ExperienceDto.class))).thenReturn(updatedExperienceDto);

        mockMvc.perform(put("/api/experiences/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(experienceDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company").value("Company A Updated"))
                .andExpect(jsonPath("$.position").value("Senior Developer"));

        verify(experienceService).updateExperience(eq("1"), any(ExperienceDto.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldDeleteExperienceWithAdminRole() throws Exception {
        doNothing().when(experienceService).deleteExperience("1");

        mockMvc.perform(delete("/api/experiences/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(experienceService).deleteExperience("1");
    }
}
