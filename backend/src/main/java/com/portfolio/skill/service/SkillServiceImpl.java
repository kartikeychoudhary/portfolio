package com.portfolio.skill.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.skill.dto.SkillDto;
import com.portfolio.skill.dto.SkillMapper;
import com.portfolio.skill.entity.Skill;
import com.portfolio.skill.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    @Autowired
    public SkillServiceImpl(SkillRepository skillRepository, SkillMapper skillMapper) {
        this.skillRepository = skillRepository;
        this.skillMapper = skillMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills() {
        List<Skill> skills = skillRepository.findAllOrderedBySort();
        return skillMapper.toDtoList(skills);
    }

    @Override
    @Transactional(readOnly = true)
    public SkillDto getSkillById(String id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        return skillMapper.toDto(skill);
    }

    @Override
    public SkillDto createSkill(SkillDto skillDto) {
        Skill skill = skillMapper.toEntity(skillDto);
        Skill savedSkill = skillRepository.save(skill);
        return skillMapper.toDto(savedSkill);
    }

    @Override
    public SkillDto updateSkill(String id, SkillDto skillDto) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));

        skillMapper.updateEntityFromDto(skillDto, skill);
        Skill updatedSkill = skillRepository.save(skill);
        return skillMapper.toDto(updatedSkill);
    }

    @Override
    public void deleteSkill(String id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        skillRepository.delete(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDto> getSkillsByCategory(String category) {
        List<Skill> skills = skillRepository.findByCategory(category);
        return skillMapper.toDtoList(skills);
    }
}
