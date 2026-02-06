package com.portfolio.profile.controller;

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
}
