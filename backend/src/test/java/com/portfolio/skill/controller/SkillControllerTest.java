package com.portfolio.skill.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.skill.dto.SkillDto;
import com.portfolio.skill.service.SkillService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SkillController.class)
class SkillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SkillService skillService;

    @Test
    void shouldGetAllSkillsWithoutAuthentication() throws Exception {
        List<SkillDto> skills = Arrays.asList(
                SkillDto.builder().id("1").name("Angular").category("frontend").proficiency(90).build(),
                SkillDto.builder().id("2").name("Spring Boot").category("backend").proficiency(88).build()
        );

        when(skillService.getAllSkills()).thenReturn(skills);

        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].name").value("Angular"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].name").value("Spring Boot"));

        verify(skillService).getAllSkills();
    }

    @Test
    void shouldGetSkillById() throws Exception {
        SkillDto skill = SkillDto.builder()
                .id("1")
                .name("Angular")
                .category("frontend")
                .proficiency(90)
                .build();

        when(skillService.getSkillById("1")).thenReturn(skill);

        mockMvc.perform(get("/api/skills/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("Angular"));

        verify(skillService).getSkillById("1");
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldCreateSkillWithAdminRole() throws Exception {
        SkillDto skillDto = SkillDto.builder()
                .name("Angular")
                .category("frontend")
                .proficiency(90)
                .sortOrder(1)
                .build();

        SkillDto savedSkillDto = SkillDto.builder()
                .id("1")
                .name("Angular")
                .category("frontend")
                .proficiency(90)
                .sortOrder(1)
                .build();

        when(skillService.createSkill(any(SkillDto.class))).thenReturn(savedSkillDto);

        mockMvc.perform(post("/api/skills")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.name").value("Angular"));

        verify(skillService).createSkill(any(SkillDto.class));
    }

    @Test
    void shouldReturn401WhenCreatingSkillWithoutAuth() throws Exception {
        SkillDto skillDto = SkillDto.builder()
                .name("Angular")
                .category("frontend")
                .proficiency(90)
                .build();

        mockMvc.perform(post("/api/skills")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillDto)))
                .andExpect(status().isUnauthorized());

        verify(skillService, never()).createSkill(any(SkillDto.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldUpdateSkillWithAdminRole() throws Exception {
        SkillDto skillDto = SkillDto.builder()
                .name("Angular Updated")
                .category("frontend")
                .proficiency(95)
                .build();

        SkillDto updatedSkillDto = SkillDto.builder()
                .id("1")
                .name("Angular Updated")
                .category("frontend")
                .proficiency(95)
                .build();

        when(skillService.updateSkill(eq("1"), any(SkillDto.class))).thenReturn(updatedSkillDto);

        mockMvc.perform(put("/api/skills/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Angular Updated"))
                .andExpect(jsonPath("$.proficiency").value(95));

        verify(skillService).updateSkill(eq("1"), any(SkillDto.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldDeleteSkillWithAdminRole() throws Exception {
        doNothing().when(skillService).deleteSkill("1");

        mockMvc.perform(delete("/api/skills/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(skillService).deleteSkill("1");
    }
}
