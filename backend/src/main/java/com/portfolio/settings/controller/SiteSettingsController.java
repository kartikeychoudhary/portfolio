package com.portfolio.settings.controller;

import com.portfolio.settings.dto.SiteSettingsDto;
import com.portfolio.settings.service.SiteSettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SiteSettingsController {

    private final SiteSettingsService settingsService;

    public SiteSettingsController(SiteSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    /**
     * Get site settings (public — needed by portfolio page).
     */
    @GetMapping
    public ResponseEntity<SiteSettingsDto> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    /**
     * Update site settings (admin only).
     */
    @PutMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<SiteSettingsDto> updateSettings(@Valid @RequestBody SiteSettingsDto dto) {
        return ResponseEntity.ok(settingsService.updateSettings(dto));
    }
}
