package com.portfolio.skill.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    private String icon;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Proficiency is required")
    @Min(value = 0, message = "Proficiency must be at least 0")
    @Max(value = 100, message = "Proficiency must be at most 100")
    private Integer proficiency;

    private Integer sortOrder;
}
