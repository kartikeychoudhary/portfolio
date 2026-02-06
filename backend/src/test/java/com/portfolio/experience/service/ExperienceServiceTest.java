package com.portfolio.experience.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.experience.dto.ExperienceDto;
import com.portfolio.experience.dto.ExperienceMapper;
import com.portfolio.experience.entity.Experience;
import com.portfolio.experience.repository.ExperienceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExperienceServiceTest {

    @Mock
    private ExperienceRepository experienceRepository;

    @Mock
    private ExperienceMapper experienceMapper;

    private ExperienceServiceImpl experienceService;

    @BeforeEach
    void setUp() {
        experienceService = new ExperienceServiceImpl(experienceRepository, experienceMapper);
    }

    @Test
    void shouldGetAllExperiences() {
        List<Experience> experiences = Arrays.asList(
                Experience.builder().id("1").company("Company A").position("Developer").startDate(LocalDate.now()).build(),
                Experience.builder().id("2").company("Company B").position("Senior Developer").startDate(LocalDate.now()).build()
        );
        List<ExperienceDto> experienceDtos = Arrays.asList(
                ExperienceDto.builder().id("1").company("Company A").position("Developer").build(),
                ExperienceDto.builder().id("2").company("Company B").position("Senior Developer").build()
        );

        when(experienceRepository.findAllOrderedBySort()).thenReturn(experiences);
        when(experienceMapper.toDtoList(experiences)).thenReturn(experienceDtos);

        List<ExperienceDto> result = experienceService.getAllExperiences();

        assertEquals(2, result.size());
        verify(experienceRepository).findAllOrderedBySort();
        verify(experienceMapper).toDtoList(experiences);
    }

    @Test
    void shouldGetExperienceById() {
        Experience experience = Experience.builder()
                .id("1")
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.now())
                .build();
        ExperienceDto experienceDto = ExperienceDto.builder()
                .id("1")
                .company("Company A")
                .position("Developer")
                .build();

        when(experienceRepository.findById("1")).thenReturn(Optional.of(experience));
        when(experienceMapper.toDto(experience)).thenReturn(experienceDto);

        ExperienceDto result = experienceService.getExperienceById("1");

        assertEquals("1", result.getId());
        assertEquals("Company A", result.getCompany());
        verify(experienceRepository).findById("1");
        verify(experienceMapper).toDto(experience);
    }

    @Test
    void shouldThrowExceptionWhenExperienceNotFound() {
        when(experienceRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            experienceService.getExperienceById("999");
        });

        verify(experienceRepository).findById("999");
    }

    @Test
    void shouldCreateExperience() {
        ExperienceDto experienceDto = ExperienceDto.builder()
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.now())
                .technologies(Arrays.asList("Java", "Spring Boot"))
                .build();

        Experience experience = Experience.builder()
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.now())
                .build();

        Experience savedExperience = Experience.builder()
                .id("1")
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.now())
                .build();

        ExperienceDto savedExperienceDto = ExperienceDto.builder()
                .id("1")
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.now())
                .technologies(Arrays.asList("Java", "Spring Boot"))
                .build();

        when(experienceMapper.toEntity(experienceDto)).thenReturn(experience);
        when(experienceRepository.save(experience)).thenReturn(savedExperience);
        when(experienceMapper.toDto(savedExperience)).thenReturn(savedExperienceDto);

        ExperienceDto result = experienceService.createExperience(experienceDto);

        assertNotNull(result.getId());
        assertEquals("Company A", result.getCompany());
        verify(experienceMapper).toEntity(experienceDto);
        verify(experienceRepository).save(experience);
        verify(experienceMapper).toDto(savedExperience);
    }

    @Test
    void shouldUpdateExperience() {
        ExperienceDto experienceDto = ExperienceDto.builder()
                .company("Company A Updated")
                .position("Senior Developer")
                .startDate(LocalDate.now())
                .build();

        Experience existingExperience = Experience.builder()
                .id("1")
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.now())
                .build();

        Experience updatedExperience = Experience.builder()
                .id("1")
                .company("Company A Updated")
                .position("Senior Developer")
                .startDate(LocalDate.now())
                .build();

        ExperienceDto updatedExperienceDto = ExperienceDto.builder()
                .id("1")
                .company("Company A Updated")
                .position("Senior Developer")
                .startDate(LocalDate.now())
                .build();

        when(experienceRepository.findById("1")).thenReturn(Optional.of(existingExperience));
        when(experienceRepository.save(existingExperience)).thenReturn(updatedExperience);
        when(experienceMapper.toDto(updatedExperience)).thenReturn(updatedExperienceDto);

        ExperienceDto result = experienceService.updateExperience("1", experienceDto);

        assertEquals("Company A Updated", result.getCompany());
        assertEquals("Senior Developer", result.getPosition());
        verify(experienceRepository).findById("1");
        verify(experienceMapper).updateEntityFromDto(experienceDto, existingExperience);
        verify(experienceRepository).save(existingExperience);
        verify(experienceMapper).toDto(updatedExperience);
    }

    @Test
    void shouldDeleteExperience() {
        Experience experience = Experience.builder()
                .id("1")
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.now())
                .build();

        when(experienceRepository.findById("1")).thenReturn(Optional.of(experience));
        doNothing().when(experienceRepository).delete(experience);

        experienceService.deleteExperience("1");

        verify(experienceRepository).findById("1");
        verify(experienceRepository).delete(experience);
    }

    @Test
    void shouldGetCurrentExperiences() {
        List<Experience> experiences = Arrays.asList(
                Experience.builder().id("1").company("Company A").position("Developer").startDate(LocalDate.now()).endDate(null).build(),
                Experience.builder().id("2").company("Company B").position("Senior Developer").startDate(LocalDate.now()).endDate(null).build()
        );
        List<ExperienceDto> experienceDtos = Arrays.asList(
                ExperienceDto.builder().id("1").company("Company A").position("Developer").build(),
                ExperienceDto.builder().id("2").company("Company B").position("Senior Developer").build()
        );

        when(experienceRepository.findCurrentExperiences()).thenReturn(experiences);
        when(experienceMapper.toDtoList(experiences)).thenReturn(experienceDtos);

        List<ExperienceDto> result = experienceService.getCurrentExperiences();

        assertEquals(2, result.size());
        verify(experienceRepository).findCurrentExperiences();
        verify(experienceMapper).toDtoList(experiences);
    }
}
