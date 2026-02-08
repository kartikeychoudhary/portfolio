package com.portfolio.profile.controller;

import com.portfolio.profile.dto.AvatarUploadRequest;
import com.portfolio.profile.dto.ProfileDto;
import com.portfolio.profile.dto.ResumeUploadRequest;
import com.portfolio.profile.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Base64;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileDto> getProfile() {
        ProfileDto profile = profileService.getProfile();
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProfileDto> updateProfile(@Valid @RequestBody ProfileDto profileDto) {
        ProfileDto updatedProfile = profileService.updateProfile(profileDto);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Upload avatar image
     * ADMIN only
     * @param profileId Profile ID (use "default" for the main profile)
     * @param request Avatar upload request with Base64 data and content type
     * @return Updated profile with new avatar
     */
    @PostMapping("/{profileId}/avatar")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProfileDto> uploadAvatar(
        @PathVariable String profileId,
        @Valid @RequestBody AvatarUploadRequest request
    ) {
        ProfileDto updated = profileService.updateAvatar(
            profileId,
            request.getAvatarBase64(),
            request.getContentType()
        );
        return ResponseEntity.ok(updated);
    }

    /**
     * Upload resume PDF
     * ADMIN only
     * @param profileId Profile ID (use "default" for the main profile)
     * @param request Resume upload request with Base64 data and content type
     * @return Updated profile with new resume
     */
    @PostMapping("/{profileId}/resume")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ProfileDto> uploadResume(
        @PathVariable String profileId,
        @Valid @RequestBody ResumeUploadRequest request
    ) {
        ProfileDto updated = profileService.updateResume(
            profileId,
            request.getResumeBase64(),
            request.getContentType()
        );
        return ResponseEntity.ok(updated);
    }

    /**
     * Get resume PDF (public endpoint)
     * Returns the resume PDF for inline viewing or download
     */
    @GetMapping("/resume")
    public ResponseEntity<byte[]> getResume() {
        ProfileDto profile = profileService.getProfile();

        if (profile.getResumeBase64() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] resumeData = Base64.getDecoder().decode(profile.getResumeBase64());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
            ContentDisposition.inline()
                .filename("resume.pdf")
                .build()
        );
        headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());

        return new ResponseEntity<>(resumeData, headers, HttpStatus.OK);
    }
}
