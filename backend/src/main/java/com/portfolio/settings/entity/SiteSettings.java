package com.portfolio.settings.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettings {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "avatar_size", nullable = false, length = 20)
    private String avatarSize;

    @Column(name = "accent_color", nullable = false, length = 7)
    private String accentColor;

    @Column(name = "font_family", nullable = false, length = 100)
    private String fontFamily;

    @Column(name = "hero_visible", nullable = false)
    private boolean heroVisible;

    @Column(name = "about_visible", nullable = false)
    private boolean aboutVisible;

    @Column(name = "skills_visible", nullable = false)
    private boolean skillsVisible;

    @Column(name = "experience_visible", nullable = false)
    private boolean experienceVisible;

    @Column(name = "projects_visible", nullable = false)
    private boolean projectsVisible;

    @Column(name = "contact_visible", nullable = false)
    private boolean contactVisible;

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
}
