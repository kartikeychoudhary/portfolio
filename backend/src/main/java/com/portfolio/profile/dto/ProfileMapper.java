package com.portfolio.profile.dto;

import com.portfolio.profile.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Mapper(componentModel = "spring", uses = {SocialLinkMapper.class})
public interface ProfileMapper {

    @Mapping(target = "avatarBase64", expression = "java(encodeAvatar(profile.getAvatarData()))")
    ProfileDto toDto(Profile profile);

    @Mapping(target = "socialLinks", ignore = true)
    @Mapping(target = "avatarData", ignore = true)
    @Mapping(target = "avatarContentType", ignore = true)
    @Mapping(target = "avatarFileSize", ignore = true)
    @Mapping(target = "avatarUpdatedAt", ignore = true)
    Profile toEntity(ProfileDto dto);

    List<ProfileDto> toDtoList(List<Profile> profiles);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "socialLinks", ignore = true)
    @Mapping(target = "avatarData", ignore = true)
    @Mapping(target = "avatarContentType", ignore = true)
    @Mapping(target = "avatarFileSize", ignore = true)
    @Mapping(target = "avatarUpdatedAt", ignore = true)
    void updateEntityFromDto(ProfileDto dto, @MappingTarget Profile profile);

    // Helper method for Base64 encoding
    default String encodeAvatar(byte[] avatarData) {
        if (avatarData == null || avatarData.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(avatarData);
    }

    // Helper method for Base64 decoding
    default byte[] decodeAvatar(String avatarBase64) {
        if (avatarBase64 == null || avatarBase64.isEmpty()) {
            return null;
        }
        try {
            return Base64.getDecoder().decode(avatarBase64);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
