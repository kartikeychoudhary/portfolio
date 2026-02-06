package com.portfolio.experience.dto;

import com.portfolio.experience.entity.Experience;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ExperienceMapper {
    @Mapping(target = "technologies", source = "technologiesList")
    ExperienceDto toDto(Experience experience);

    @Mapping(target = "technologies", ignore = true)
    Experience toEntity(ExperienceDto dto);

    @AfterMapping
    default void setTechnologiesList(ExperienceDto dto, @MappingTarget Experience experience) {
        experience.setTechnologiesList(dto.getTechnologies());
    }

    List<ExperienceDto> toDtoList(List<Experience> experiences);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "technologies", ignore = true)
    void updateEntityFromDto(ExperienceDto dto, @MappingTarget Experience experience);

    @AfterMapping
    default void updateTechnologiesList(ExperienceDto dto, @MappingTarget Experience experience) {
        experience.setTechnologiesList(dto.getTechnologies());
    }
}
