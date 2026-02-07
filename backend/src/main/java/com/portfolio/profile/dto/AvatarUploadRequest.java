package com.portfolio.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvatarUploadRequest {

    @NotBlank(message = "Avatar data is required")
    private String avatarBase64;

    @NotBlank(message = "Content type is required")
    @Pattern(regexp = "image/(jpeg|png|webp)", message = "Invalid content type. Allowed: image/jpeg, image/png, image/webp")
    private String contentType;
}
