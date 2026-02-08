package com.portfolio.project.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedQueries({
    @NamedQuery(
        name = "Project.findAllOrderedBySort",
        query = "SELECT p FROM Project p ORDER BY p.sortOrder"
    ),
    @NamedQuery(
        name = "Project.findFeaturedProjects",
        query = "SELECT p FROM Project p WHERE p.featured = true ORDER BY p.sortOrder"
    )
})
public class Project {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "JSON")
    private String technologies;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Lob
    @Column(name = "thumbnail_data", columnDefinition = "LONGBLOB")
    private byte[] thumbnailData;

    @Column(name = "thumbnail_content_type", length = 50)
    private String thumbnailContentType;

    @Column(name = "thumbnail_file_size")
    private Integer thumbnailFileSize;

    @Column(name = "thumbnail_updated_at")
    private LocalDateTime thumbnailUpdatedAt;

    @Column(name = "project_url", length = 500)
    private String projectUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "sort_order")
    private int sortOrder;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void prePersist() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Transient
    public List<String> getTechnologiesList() {
        if (technologies == null || technologies.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(technologies, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    public void setTechnologiesList(List<String> technologiesList) {
        if (technologiesList == null || technologiesList.isEmpty()) {
            this.technologies = null;
            return;
        }
        try {
            this.technologies = objectMapper.writeValueAsString(technologiesList);
        } catch (JsonProcessingException e) {
            this.technologies = null;
        }
    }
}
