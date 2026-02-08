package com.portfolio.settings.dto;

import com.portfolio.settings.entity.SiteSettings;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SiteSettingsMapper {

    SiteSettingsDto toDto(SiteSettings entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(SiteSettingsDto dto, @MappingTarget SiteSettings entity);
}
