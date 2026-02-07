package com.portfolio.profile.controller;

import com.portfolio.profile.dto.AvatarUploadRequest;
import com.portfolio.profile.dto.ProfileDto;
import com.portfolio.profile.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}
