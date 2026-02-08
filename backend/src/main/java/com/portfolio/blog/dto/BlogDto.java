package com.portfolio.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogDto {
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    private String excerpt;

    @NotBlank(message = "Content is required")
    private String content;

    private String coverImage;
    private String coverImageContentType;
    private Integer coverImageFileSize;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @NotNull(message = "Published status is required")
    private Boolean published;

    private LocalDateTime publishedDate;
    private Integer readingTime;
}
