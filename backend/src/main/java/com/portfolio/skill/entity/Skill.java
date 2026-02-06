package com.portfolio.skill.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedQueries({
    @NamedQuery(
        name = "Skill.findByCategory",
        query = "SELECT s FROM Skill s WHERE s.category = :category ORDER BY s.sortOrder"
    ),
    @NamedQuery(
        name = "Skill.findAllOrderedBySort",
        query = "SELECT s FROM Skill s ORDER BY s.sortOrder"
    )
})
public class Skill {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String icon;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false)
    private int proficiency;

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
}
