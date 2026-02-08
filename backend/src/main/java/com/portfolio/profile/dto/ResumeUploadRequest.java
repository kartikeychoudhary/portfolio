package com.portfolio.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeUploadRequest {

    @NotBlank(message = "Resume data is required")
    private String resumeBase64;

    @NotBlank(message = "Content type is required")
    @Pattern(regexp = "application/pdf", message = "Invalid content type. Only PDF (application/pdf) is allowed")
    private String contentType;
}
