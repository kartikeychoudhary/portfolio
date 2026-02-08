package com.portfolio.project.service;

import com.portfolio.project.dto.ProjectDto;

import java.util.List;

public interface ProjectService {
    List<ProjectDto> getAllProjects();
    ProjectDto getProjectById(String id);
    ProjectDto createProject(ProjectDto projectDto);
    ProjectDto updateProject(String id, ProjectDto projectDto);
    void deleteProject(String id);
    List<ProjectDto> getFeaturedProjects();
    ProjectDto updateThumbnail(String projectId, String thumbnailBase64, String contentType);
}
