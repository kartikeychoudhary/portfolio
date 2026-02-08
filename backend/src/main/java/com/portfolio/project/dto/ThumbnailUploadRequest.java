package com.portfolio.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThumbnailUploadRequest {

    @NotBlank(message = "Thumbnail data is required")
    private String thumbnailBase64;

    @NotBlank(message = "Content type is required")
    @Pattern(regexp = "image/(jpeg|png|webp)", message = "Invalid content type. Allowed: image/jpeg, image/png, image/webp")
    private String contentType;
}
