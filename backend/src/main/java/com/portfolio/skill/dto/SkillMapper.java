package com.portfolio.skill.dto;

import com.portfolio.skill.entity.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SkillMapper {
    SkillDto toDto(Skill skill);
    Skill toEntity(SkillDto dto);
    List<SkillDto> toDtoList(List<Skill> skills);
    void updateEntityFromDto(SkillDto dto, @MappingTarget Skill skill);
}
