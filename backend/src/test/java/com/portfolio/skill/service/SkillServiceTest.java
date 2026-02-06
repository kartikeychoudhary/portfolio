package com.portfolio.skill.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.skill.dto.SkillDto;
import com.portfolio.skill.dto.SkillMapper;
import com.portfolio.skill.entity.Skill;
import com.portfolio.skill.repository.SkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillServiceTest {

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private SkillMapper skillMapper;

    private SkillServiceImpl skillService;

    @BeforeEach
    void setUp() {
        skillService = new SkillServiceImpl(skillRepository, skillMapper);
    }

    @Test
    void shouldGetAllSkills() {
        List<Skill> skills = Arrays.asList(
                Skill.builder().id("1").name("Angular").category("frontend").build(),
                Skill.builder().id("2").name("Spring Boot").category("backend").build()
        );
        List<SkillDto> skillDtos = Arrays.asList(
                SkillDto.builder().id("1").name("Angular").category("frontend").build(),
                SkillDto.builder().id("2").name("Spring Boot").category("backend").build()
        );

        when(skillRepository.findAllOrderedBySort()).thenReturn(skills);
        when(skillMapper.toDtoList(skills)).thenReturn(skillDtos);

        List<SkillDto> result = skillService.getAllSkills();

        assertEquals(2, result.size());
        verify(skillRepository).findAllOrderedBySort();
        verify(skillMapper).toDtoList(skills);
    }

    @Test
    void shouldGetSkillById() {
        Skill skill = Skill.builder().id("1").name("Angular").category("frontend").build();
        SkillDto skillDto = SkillDto.builder().id("1").name("Angular").category("frontend").build();

        when(skillRepository.findById("1")).thenReturn(Optional.of(skill));
        when(skillMapper.toDto(skill)).thenReturn(skillDto);

        SkillDto result = skillService.getSkillById("1");

        assertEquals("1", result.getId());
        assertEquals("Angular", result.getName());
        verify(skillRepository).findById("1");
        verify(skillMapper).toDto(skill);
    }

    @Test
    void shouldThrowExceptionWhenSkillNotFound() {
        when(skillRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            skillService.getSkillById("999");
        });

        verify(skillRepository).findById("999");
    }

    @Test
    void shouldCreateSkill() {
        SkillDto skillDto = SkillDto.builder().name("Angular").category("frontend").proficiency(90).build();
        Skill skill = Skill.builder().name("Angular").category("frontend").proficiency(90).build();
        Skill savedSkill = Skill.builder().id("1").name("Angular").category("frontend").proficiency(90).build();
        SkillDto savedSkillDto = SkillDto.builder().id("1").name("Angular").category("frontend").proficiency(90).build();

        when(skillMapper.toEntity(skillDto)).thenReturn(skill);
        when(skillRepository.save(skill)).thenReturn(savedSkill);
        when(skillMapper.toDto(savedSkill)).thenReturn(savedSkillDto);

        SkillDto result = skillService.createSkill(skillDto);

        assertNotNull(result.getId());
        assertEquals("Angular", result.getName());
        verify(skillMapper).toEntity(skillDto);
        verify(skillRepository).save(skill);
        verify(skillMapper).toDto(savedSkill);
    }

    @Test
    void shouldUpdateSkill() {
        SkillDto skillDto = SkillDto.builder().name("Angular Updated").category("frontend").proficiency(95).build();
        Skill existingSkill = Skill.builder().id("1").name("Angular").category("frontend").proficiency(90).build();
        Skill updatedSkill = Skill.builder().id("1").name("Angular Updated").category("frontend").proficiency(95).build();
        SkillDto updatedSkillDto = SkillDto.builder().id("1").name("Angular Updated").category("frontend").proficiency(95).build();

        when(skillRepository.findById("1")).thenReturn(Optional.of(existingSkill));
        when(skillRepository.save(existingSkill)).thenReturn(updatedSkill);
        when(skillMapper.toDto(updatedSkill)).thenReturn(updatedSkillDto);

        SkillDto result = skillService.updateSkill("1", skillDto);

        assertEquals("Angular Updated", result.getName());
        assertEquals(95, result.getProficiency());
        verify(skillRepository).findById("1");
        verify(skillMapper).updateEntityFromDto(skillDto, existingSkill);
        verify(skillRepository).save(existingSkill);
        verify(skillMapper).toDto(updatedSkill);
    }

    @Test
    void shouldDeleteSkill() {
        Skill skill = Skill.builder().id("1").name("Angular").category("frontend").build();

        when(skillRepository.findById("1")).thenReturn(Optional.of(skill));
        doNothing().when(skillRepository).delete(skill);

        skillService.deleteSkill("1");

        verify(skillRepository).findById("1");
        verify(skillRepository).delete(skill);
    }

    @Test
    void shouldGetSkillsByCategory() {
        List<Skill> skills = Arrays.asList(
                Skill.builder().id("1").name("Angular").category("frontend").build(),
                Skill.builder().id("2").name("React").category("frontend").build()
        );
        List<SkillDto> skillDtos = Arrays.asList(
                SkillDto.builder().id("1").name("Angular").category("frontend").build(),
                SkillDto.builder().id("2").name("React").category("frontend").build()
        );

        when(skillRepository.findByCategory("frontend")).thenReturn(skills);
        when(skillMapper.toDtoList(skills)).thenReturn(skillDtos);

        List<SkillDto> result = skillService.getSkillsByCategory("frontend");

        assertEquals(2, result.size());
        verify(skillRepository).findByCategory("frontend");
        verify(skillMapper).toDtoList(skills);
    }
}
