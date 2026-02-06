package com.portfolio.profile.dto;

import com.portfolio.profile.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = {SocialLinkMapper.class})
public interface ProfileMapper {
    ProfileDto toDto(Profile profile);

    @Mapping(target = "socialLinks", ignore = true)
    Profile toEntity(ProfileDto dto);

    List<ProfileDto> toDtoList(List<Profile> profiles);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "socialLinks", ignore = true)
    void updateEntityFromDto(ProfileDto dto, @MappingTarget Profile profile);
}
