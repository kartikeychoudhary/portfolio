package com.portfolio.settings.service;

import com.portfolio.settings.dto.SiteSettingsDto;

public interface SiteSettingsService {

    /**
     * Gets the current site settings (single row).
     * @return the site settings DTO
     */
    SiteSettingsDto getSettings();

    /**
     * Updates the site settings.
     * @param dto the updated settings
     * @return the saved settings DTO
     */
    SiteSettingsDto updateSettings(SiteSettingsDto dto);
}
