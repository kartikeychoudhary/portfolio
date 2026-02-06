package com.portfolio.experience.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.experience.dto.ExperienceDto;
import com.portfolio.experience.dto.ExperienceMapper;
import com.portfolio.experience.entity.Experience;
import com.portfolio.experience.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final ExperienceMapper experienceMapper;

    @Autowired
    public ExperienceServiceImpl(ExperienceRepository experienceRepository, ExperienceMapper experienceMapper) {
        this.experienceRepository = experienceRepository;
        this.experienceMapper = experienceMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceDto> getAllExperiences() {
        List<Experience> experiences = experienceRepository.findAllOrderedBySort();
        return experienceMapper.toDtoList(experiences);
    }

    @Override
    @Transactional(readOnly = true)
    public ExperienceDto getExperienceById(String id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        return experienceMapper.toDto(experience);
    }

    @Override
    public ExperienceDto createExperience(ExperienceDto experienceDto) {
        Experience experience = experienceMapper.toEntity(experienceDto);
        Experience savedExperience = experienceRepository.save(experience);
        return experienceMapper.toDto(savedExperience);
    }

    @Override
    public ExperienceDto updateExperience(String id, ExperienceDto experienceDto) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));

        experienceMapper.updateEntityFromDto(experienceDto, experience);
        Experience updatedExperience = experienceRepository.save(experience);
        return experienceMapper.toDto(updatedExperience);
    }

    @Override
    public void deleteExperience(String id) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
        experienceRepository.delete(experience);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceDto> getCurrentExperiences() {
        List<Experience> experiences = experienceRepository.findCurrentExperiences();
        return experienceMapper.toDtoList(experiences);
    }
}
