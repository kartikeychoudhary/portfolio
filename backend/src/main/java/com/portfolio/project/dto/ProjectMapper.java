package com.portfolio.project.dto;

import com.portfolio.project.entity.Project;
import org.mapstruct.*;

import java.util.Base64;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    @Mapping(target = "technologies", source = "technologiesList")
    @Mapping(target = "thumbnailBase64", expression = "java(encodeThumbnail(project.getThumbnailData()))")
    ProjectDto toDto(Project project);

    @Mapping(target = "technologies", ignore = true)
    @Mapping(target = "thumbnailData", ignore = true)
    @Mapping(target = "thumbnailContentType", ignore = true)
    @Mapping(target = "thumbnailFileSize", ignore = true)
    @Mapping(target = "thumbnailUpdatedAt", ignore = true)
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
    @Mapping(target = "thumbnailData", ignore = true)
    @Mapping(target = "thumbnailContentType", ignore = true)
    @Mapping(target = "thumbnailFileSize", ignore = true)
    @Mapping(target = "thumbnailUpdatedAt", ignore = true)
    void updateEntityFromDto(ProjectDto dto, @MappingTarget Project project);

    @AfterMapping
    default void updateTechnologiesList(ProjectDto dto, @MappingTarget Project project) {
        project.setTechnologiesList(dto.getTechnologies());
    }

    // Helper method for Base64 encoding thumbnail
    default String encodeThumbnail(byte[] thumbnailData) {
        if (thumbnailData == null || thumbnailData.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(thumbnailData);
    }
}
