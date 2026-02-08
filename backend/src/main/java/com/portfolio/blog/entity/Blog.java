package com.portfolio.blog.entity;

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
@Table(name = "blogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@NamedQueries({
    @NamedQuery(
        name = "Blog.findBySlug",
        query = "SELECT b FROM Blog b WHERE b.slug = :slug"
    ),
    @NamedQuery(
        name = "Blog.findPublishedBlogs",
        query = "SELECT b FROM Blog b WHERE b.published = true ORDER BY b.publishedDate DESC"
    )
})
public class Blog {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 250)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Lob
    @Column(name = "cover_image_data", columnDefinition = "MEDIUMBLOB")
    private byte[] coverImageData;

    @Column(name = "cover_image_content_type", length = 50)
    private String coverImageContentType;

    @Column(name = "cover_image_file_size")
    private Integer coverImageFileSize;

    @Column(columnDefinition = "JSON")
    private String tags;

    @Column(name = "is_published", nullable = false)
    private boolean published;

    @Column(name = "published_at")
    private LocalDateTime publishedDate;

    @Transient
    private Integer readingTime;

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
    public List<String> getTagsList() {
        if (tags == null || tags.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(tags, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    public void setTagsList(List<String> tagsList) {
        if (tagsList == null || tagsList.isEmpty()) {
            this.tags = null;
            return;
        }
        try {
            this.tags = objectMapper.writeValueAsString(tagsList);
        } catch (JsonProcessingException e) {
            this.tags = null;
        }
    }
}
