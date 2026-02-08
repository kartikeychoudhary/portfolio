package com.portfolio.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Builder.Default
    private List<String> technologies = new ArrayList<>();

    private String imageUrl;
    private String projectUrl;
    private String githubUrl;

    @JsonProperty("thumbnailBase64")
    private String thumbnailBase64;

    @JsonProperty("thumbnailContentType")
    private String thumbnailContentType;

    @JsonProperty("thumbnailFileSize")
    private Integer thumbnailFileSize;

    @NotNull(message = "Featured status is required")
    private Boolean featured;

    private Integer sortOrder;
}
