package com.portfolio.skill.service;

import com.portfolio.skill.dto.SkillDto;

import java.util.List;

public interface SkillService {
    List<SkillDto> getAllSkills();
    SkillDto getSkillById(String id);
    SkillDto createSkill(SkillDto skillDto);
    SkillDto updateSkill(String id, SkillDto skillDto);
    void deleteSkill(String id);
    List<SkillDto> getSkillsByCategory(String category);
}
