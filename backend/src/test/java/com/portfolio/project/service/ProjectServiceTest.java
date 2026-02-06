package com.portfolio.project.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.project.dto.ProjectDto;
import com.portfolio.project.dto.ProjectMapper;
import com.portfolio.project.entity.Project;
import com.portfolio.project.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMapper projectMapper;

    private ProjectServiceImpl projectService;

    @BeforeEach
    void setUp() {
        projectService = new ProjectServiceImpl(projectRepository, projectMapper);
    }

    @Test
    void shouldGetAllProjects() {
        List<Project> projects = Arrays.asList(
                Project.builder().id("1").title("Project A").featured(true).build(),
                Project.builder().id("2").title("Project B").featured(false).build()
        );
        List<ProjectDto> projectDtos = Arrays.asList(
                ProjectDto.builder().id("1").title("Project A").featured(true).build(),
                ProjectDto.builder().id("2").title("Project B").featured(false).build()
        );

        when(projectRepository.findAllOrderedBySort()).thenReturn(projects);
        when(projectMapper.toDtoList(projects)).thenReturn(projectDtos);

        List<ProjectDto> result = projectService.getAllProjects();

        assertEquals(2, result.size());
        verify(projectRepository).findAllOrderedBySort();
        verify(projectMapper).toDtoList(projects);
    }

    @Test
    void shouldGetProjectById() {
        Project project = Project.builder()
                .id("1")
                .title("Project A")
                .featured(true)
                .build();
        ProjectDto projectDto = ProjectDto.builder()
                .id("1")
                .title("Project A")
                .featured(true)
                .build();

        when(projectRepository.findById("1")).thenReturn(Optional.of(project));
        when(projectMapper.toDto(project)).thenReturn(projectDto);

        ProjectDto result = projectService.getProjectById("1");

        assertEquals("1", result.getId());
        assertEquals("Project A", result.getTitle());
        verify(projectRepository).findById("1");
        verify(projectMapper).toDto(project);
    }

    @Test
    void shouldThrowExceptionWhenProjectNotFound() {
        when(projectRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.getProjectById("999");
        });

        verify(projectRepository).findById("999");
    }

    @Test
    void shouldCreateProject() {
        ProjectDto projectDto = ProjectDto.builder()
                .title("New Project")
                .description("Description")
                .featured(true)
                .technologies(Arrays.asList("React", "Spring Boot"))
                .build();

        Project project = Project.builder()
                .title("New Project")
                .description("Description")
                .featured(true)
                .build();

        Project savedProject = Project.builder()
                .id("1")
                .title("New Project")
                .description("Description")
                .featured(true)
                .build();

        ProjectDto savedProjectDto = ProjectDto.builder()
                .id("1")
                .title("New Project")
                .description("Description")
                .featured(true)
                .technologies(Arrays.asList("React", "Spring Boot"))
                .build();

        when(projectMapper.toEntity(projectDto)).thenReturn(project);
        when(projectRepository.save(project)).thenReturn(savedProject);
        when(projectMapper.toDto(savedProject)).thenReturn(savedProjectDto);

        ProjectDto result = projectService.createProject(projectDto);

        assertNotNull(result.getId());
        assertEquals("New Project", result.getTitle());
        verify(projectMapper).toEntity(projectDto);
        verify(projectRepository).save(project);
        verify(projectMapper).toDto(savedProject);
    }

    @Test
    void shouldUpdateProject() {
        ProjectDto projectDto = ProjectDto.builder()
                .title("Updated Project")
                .description("Updated Description")
                .featured(false)
                .build();

        Project existingProject = Project.builder()
                .id("1")
                .title("Original Project")
                .description("Original Description")
                .featured(true)
                .build();

        Project updatedProject = Project.builder()
                .id("1")
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

        when(projectRepository.findById("1")).thenReturn(Optional.of(existingProject));
        when(projectRepository.save(existingProject)).thenReturn(updatedProject);
        when(projectMapper.toDto(updatedProject)).thenReturn(updatedProjectDto);

        ProjectDto result = projectService.updateProject("1", projectDto);

        assertEquals("Updated Project", result.getTitle());
        assertEquals("Updated Description", result.getDescription());
        verify(projectRepository).findById("1");
        verify(projectMapper).updateEntityFromDto(projectDto, existingProject);
        verify(projectRepository).save(existingProject);
        verify(projectMapper).toDto(updatedProject);
    }

    @Test
    void shouldDeleteProject() {
        Project project = Project.builder()
                .id("1")
                .title("Project A")
                .featured(true)
                .build();

        when(projectRepository.findById("1")).thenReturn(Optional.of(project));
        doNothing().when(projectRepository).delete(project);

        projectService.deleteProject("1");

        verify(projectRepository).findById("1");
        verify(projectRepository).delete(project);
    }

    @Test
    void shouldGetFeaturedProjects() {
        List<Project> projects = Arrays.asList(
                Project.builder().id("1").title("Featured Project A").featured(true).build(),
                Project.builder().id("2").title("Featured Project B").featured(true).build()
        );
        List<ProjectDto> projectDtos = Arrays.asList(
                ProjectDto.builder().id("1").title("Featured Project A").featured(true).build(),
                ProjectDto.builder().id("2").title("Featured Project B").featured(true).build()
        );

        when(projectRepository.findFeaturedProjects()).thenReturn(projects);
        when(projectMapper.toDtoList(projects)).thenReturn(projectDtos);

        List<ProjectDto> result = projectService.getFeaturedProjects();

        assertEquals(2, result.size());
        verify(projectRepository).findFeaturedProjects();
        verify(projectMapper).toDtoList(projects);
    }
}
