package com.portfolio.project.dto;

import com.portfolio.project.entity.Project;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    @Mapping(target = "technologies", source = "technologiesList")
    ProjectDto toDto(Project project);

    @Mapping(target = "technologies", ignore = true)
    Project toEntity(ProjectDto dto);

    @AfterMapping
    default void setTechnologiesList(ProjectDto dto, @MappingTarget Project project) {
        project.setTechnologiesList(dto.getTechnologies());
    }

    List<ProjectDto> toDtoList(List<Project> projects);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "technologies", ignore = true)
    void updateEntityFromDto(ProjectDto dto, @MappingTarget Project project);

    @AfterMapping
    default void updateTechnologiesList(ProjectDto dto, @MappingTarget Project project) {
        project.setTechnologiesList(dto.getTechnologies());
    }
}
