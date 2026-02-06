package com.portfolio.experience.controller;

import com.portfolio.experience.dto.ExperienceDto;
import com.portfolio.experience.service.ExperienceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExperienceController {

    @Autowired
    private ExperienceService experienceService;

    @GetMapping
    public ResponseEntity<List<ExperienceDto>> getAllExperiences() {
        List<ExperienceDto> experiences = experienceService.getAllExperiences();
        return ResponseEntity.ok(experiences);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExperienceDto> getExperienceById(@PathVariable String id) {
        ExperienceDto experience = experienceService.getExperienceById(id);
        return ResponseEntity.ok(experience);
    }

    @GetMapping("/current")
    public ResponseEntity<List<ExperienceDto>> getCurrentExperiences() {
        List<ExperienceDto> experiences = experienceService.getCurrentExperiences();
        return ResponseEntity.ok(experiences);
    }

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ExperienceDto> createExperience(@Valid @RequestBody ExperienceDto experienceDto) {
        ExperienceDto createdExperience = experienceService.createExperience(experienceDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdExperience);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ExperienceDto> updateExperience(@PathVariable String id, @Valid @RequestBody ExperienceDto experienceDto) {
        ExperienceDto updatedExperience = experienceService.updateExperience(id, experienceDto);
        return ResponseEntity.ok(updatedExperience);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteExperience(@PathVariable String id) {
        experienceService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}
