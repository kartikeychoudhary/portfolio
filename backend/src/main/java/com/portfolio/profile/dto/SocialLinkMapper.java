package com.portfolio.profile.dto;

import com.portfolio.profile.entity.SocialLink;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SocialLinkMapper {
    SocialLinkDto toDto(SocialLink socialLink);

    @Mapping(target = "profile", ignore = true)
    SocialLink toEntity(SocialLinkDto dto);

    List<SocialLinkDto> toDtoList(List<SocialLink> socialLinks);

    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(SocialLinkDto dto, @MappingTarget SocialLink socialLink);
}
