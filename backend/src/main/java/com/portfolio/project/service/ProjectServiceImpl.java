package com.portfolio.project.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.project.dto.ProjectDto;
import com.portfolio.project.dto.ProjectMapper;
import com.portfolio.project.entity.Project;
import com.portfolio.project.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final ProjectImageValidationService imageValidationService;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository,
                             ProjectMapper projectMapper,
                             ProjectImageValidationService imageValidationService) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
        this.imageValidationService = imageValidationService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        List<Project> projects = projectRepository.findAllOrderedBySort();
        return projectMapper.toDtoList(projects);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDto getProjectById(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return projectMapper.toDto(project);
    }

    @Override
    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = projectMapper.toEntity(projectDto);
        Project savedProject = projectRepository.save(project);
        return projectMapper.toDto(savedProject);
    }

    @Override
    public ProjectDto updateProject(String id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        projectMapper.updateEntityFromDto(projectDto, project);
        Project updatedProject = projectRepository.save(project);
        return projectMapper.toDto(updatedProject);
    }

    @Override
    public void deleteProject(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        projectRepository.delete(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getFeaturedProjects() {
        List<Project> projects = projectRepository.findFeaturedProjects();
        return projectMapper.toDtoList(projects);
    }

    @Override
    public ProjectDto updateThumbnail(String projectId, String thumbnailBase64, String contentType) {
        // Validate thumbnail data
        byte[] thumbnailData = imageValidationService.validateAndDecode(thumbnailBase64, contentType);

        // Get project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        // Update thumbnail
        project.setThumbnailData(thumbnailData);
        project.setThumbnailContentType(contentType);
        project.setThumbnailFileSize(thumbnailData.length);
        project.setThumbnailUpdatedAt(LocalDateTime.now());

        // Save and return
        Project saved = projectRepository.save(project);
        return projectMapper.toDto(saved);
    }
}
