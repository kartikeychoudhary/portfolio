package com.portfolio.experience.service;

import com.portfolio.experience.dto.ExperienceDto;

import java.util.List;

public interface ExperienceService {
    List<ExperienceDto> getAllExperiences();
    ExperienceDto getExperienceById(String id);
    ExperienceDto createExperience(ExperienceDto experienceDto);
    ExperienceDto updateExperience(String id, ExperienceDto experienceDto);
    void deleteExperience(String id);
    List<ExperienceDto> getCurrentExperiences();
}
