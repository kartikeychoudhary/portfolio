package com.portfolio.settings.service;

import com.portfolio.settings.dto.SiteSettingsDto;
import com.portfolio.settings.dto.SiteSettingsMapper;
import com.portfolio.settings.entity.SiteSettings;
import com.portfolio.settings.repository.SiteSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SiteSettingsServiceImpl implements SiteSettingsService {

    private final SiteSettingsRepository repository;
    private final SiteSettingsMapper mapper;

    public SiteSettingsServiceImpl(SiteSettingsRepository repository, SiteSettingsMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public SiteSettingsDto getSettings() {
        SiteSettings settings = repository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Site settings not found. Please run database migrations."));
        return mapper.toDto(settings);
    }

    @Override
    public SiteSettingsDto updateSettings(SiteSettingsDto dto) {
        SiteSettings settings = repository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Site settings not found. Please run database migrations."));

        mapper.updateEntityFromDto(dto, settings);
        SiteSettings saved = repository.save(settings);
        return mapper.toDto(saved);
    }
}
