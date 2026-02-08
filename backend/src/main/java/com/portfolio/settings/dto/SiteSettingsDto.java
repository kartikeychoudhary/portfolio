package com.portfolio.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSettingsDto {

    private String id;

    @Pattern(regexp = "small|medium|large|xlarge", message = "Avatar size must be small, medium, large, or xlarge")
    private String avatarSize;

    @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "Accent color must be a valid hex color (e.g. #3b82f6)")
    private String accentColor;

    @NotBlank(message = "Font family is required")
    private String fontFamily;

    private boolean heroVisible;
    private boolean aboutVisible;
    private boolean skillsVisible;
    private boolean experienceVisible;
    private boolean projectsVisible;
    private boolean contactVisible;
}
