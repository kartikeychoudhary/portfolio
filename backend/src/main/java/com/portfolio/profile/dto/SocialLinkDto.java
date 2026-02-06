package com.portfolio.profile.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialLinkDto {
    private String id;

    @NotBlank(message = "Platform is required")
    private String platform;

    @NotBlank(message = "URL is required")
    private String url;

    private String icon;
    private Integer sortOrder;
}
