package com.portfolio.project.controller;

import com.portfolio.project.dto.ProjectDto;
import com.portfolio.project.dto.ThumbnailUploadRequest;
import com.portfolio.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable String id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProjectDto>> getFeaturedProjects() {
        List<ProjectDto> projects = projectService.getFeaturedProjects();
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProjectDto> createProject(@Valid @RequestBody ProjectDto projectDto) {
        ProjectDto createdProject = projectService.createProject(projectDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProjectDto> updateProject(@PathVariable String id, @Valid @RequestBody ProjectDto projectDto) {
        ProjectDto updatedProject = projectService.updateProject(id, projectDto);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Upload project thumbnail image
     * ADMIN only
     */
    @PostMapping("/{id}/thumbnail")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProjectDto> uploadThumbnail(
        @PathVariable String id,
        @Valid @RequestBody ThumbnailUploadRequest request
    ) {
        ProjectDto updated = projectService.updateThumbnail(
            id,
            request.getThumbnailBase64(),
            request.getContentType()
        );
        return ResponseEntity.ok(updated);
    }

    /**
     * Get project thumbnail image (public endpoint)
     */
    @GetMapping("/{id}/thumbnail")
    public ResponseEntity<byte[]> getThumbnail(@PathVariable String id) {
        ProjectDto project = projectService.getProjectById(id);

        if (project.getThumbnailBase64() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] thumbnailData = Base64.getDecoder().decode(project.getThumbnailBase64());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(project.getThumbnailContentType()));
        headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());

        return new ResponseEntity<>(thumbnailData, headers, HttpStatus.OK);
    }
}
