package com.portfolio.experience.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedQueries({
    @NamedQuery(
        name = "Experience.findAllOrderedBySort",
        query = "SELECT e FROM Experience e ORDER BY e.sortOrder"
    ),
    @NamedQuery(
        name = "Experience.findCurrentExperiences",
        query = "SELECT e FROM Experience e WHERE e.endDate IS NULL ORDER BY e.startDate DESC"
    )
})
public class Experience {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 100)
    private String company;

    @Column(nullable = false, length = 100)
    private String position;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "JSON")
    private String technologies;

    @Transient
    private String companyUrl;

    @Column(length = 100)
    private String location;

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
