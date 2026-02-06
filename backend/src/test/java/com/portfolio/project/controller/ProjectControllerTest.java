package com.portfolio.project.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.project.dto.ProjectDto;
import com.portfolio.project.service.ProjectService;
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

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectService projectService;

    @Test
    void shouldGetAllProjectsWithoutAuthentication() throws Exception {
        List<ProjectDto> projects = Arrays.asList(
                ProjectDto.builder()
                        .id("1")
                        .title("Project A")
                        .description("Description A")
                        .featured(true)
                        .technologies(Arrays.asList("React", "Node.js"))
                        .build(),
                ProjectDto.builder()
                        .id("2")
                        .title("Project B")
                        .description("Description B")
                        .featured(false)
                        .build()
        );

        when(projectService.getAllProjects()).thenReturn(projects);

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].title").value("Project A"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].title").value("Project B"));

        verify(projectService).getAllProjects();
    }

    @Test
    void shouldGetProjectById() throws Exception {
        ProjectDto project = ProjectDto.builder()
                .id("1")
                .title("Project A")
                .description("Description A")
                .featured(true)
                .build();

        when(projectService.getProjectById("1")).thenReturn(project);

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.title").value("Project A"));

        verify(projectService).getProjectById("1");
    }

    @Test
    void shouldGetFeaturedProjects() throws Exception {
        List<ProjectDto> projects = Arrays.asList(
                ProjectDto.builder()
                        .id("1")
                        .title("Featured Project")
                        .featured(true)
                        .build()
        );

        when(projectService.getFeaturedProjects()).thenReturn(projects);

        mockMvc.perform(get("/api/projects/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].title").value("Featured Project"));

        verify(projectService).getFeaturedProjects();
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldCreateProjectWithAdminRole() throws Exception {
        ProjectDto projectDto = ProjectDto.builder()
                .title("New Project")
                .description("Description")
                .featured(true)
                .technologies(Arrays.asList("React", "Spring Boot"))
                .sortOrder(1)
                .build();

        ProjectDto savedProjectDto = ProjectDto.builder()
                .id("1")
                .title("New Project")
                .description("Description")
                .featured(true)
                .technologies(Arrays.asList("React", "Spring Boot"))
                .sortOrder(1)
                .build();

        when(projectService.createProject(any(ProjectDto.class))).thenReturn(savedProjectDto);

        mockMvc.perform(post("/api/projects")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.title").value("New Project"));

        verify(projectService).createProject(any(ProjectDto.class));
    }

    @Test
    void shouldReturn401WhenCreatingProjectWithoutAuth() throws Exception {
        ProjectDto projectDto = ProjectDto.builder()
                .title("New Project")
                .description("Description")
                .featured(true)
                .build();

        mockMvc.perform(post("/api/projects")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectDto)))
                .andExpect(status().isUnauthorized());

        verify(projectService, never()).createProject(any(ProjectDto.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldUpdateProjectWithAdminRole() throws Exception {
        ProjectDto projectDto = ProjectDto.builder()
                .title("Updated Project")
                .description("Updated Description")
                .featured(false)
                .build();

        ProjectDto updatedProjectDto = ProjectDto.builder()
                .id("1")
                .title("Updated Project")
                .description("Updated Description")
                .featured(false)
                .build();

        when(projectService.updateProject(eq("1"), any(ProjectDto.class))).thenReturn(updatedProjectDto);

        mockMvc.perform(put("/api/projects/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Project"))
                .andExpect(jsonPath("$.description").value("Updated Description"));

        verify(projectService).updateProject(eq("1"), any(ProjectDto.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldDeleteProjectWithAdminRole() throws Exception {
        doNothing().when(projectService).deleteProject("1");

        mockMvc.perform(delete("/api/projects/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(projectService).deleteProject("1");
    }
}
