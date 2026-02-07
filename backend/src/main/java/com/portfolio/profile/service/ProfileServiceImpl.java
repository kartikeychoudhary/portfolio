package com.portfolio.profile.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.profile.dto.ProfileDto;
import com.portfolio.profile.dto.ProfileMapper;
import com.portfolio.profile.dto.SocialLinkMapper;
import com.portfolio.profile.entity.Profile;
import com.portfolio.profile.entity.SocialLink;
import com.portfolio.profile.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;
    private final SocialLinkMapper socialLinkMapper;
    private final AvatarValidationService avatarValidationService;

    @Autowired
    public ProfileServiceImpl(ProfileRepository profileRepository,
                             ProfileMapper profileMapper,
                             SocialLinkMapper socialLinkMapper,
                             AvatarValidationService avatarValidationService) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
        this.socialLinkMapper = socialLinkMapper;
        this.avatarValidationService = avatarValidationService;
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileDto getProfile() {
        List<Profile> profiles = profileRepository.findAll();
        if (profiles.isEmpty()) {
            throw new ResourceNotFoundException("Profile", "id", "default");
        }
        return profileMapper.toDto(profiles.get(0));
    }

    @Override
    public ProfileDto updateProfile(ProfileDto profileDto) {
        List<Profile> profiles = profileRepository.findAll();
        Profile profile;

        if (profiles.isEmpty()) {
            profile = profileMapper.toEntity(profileDto);
        } else {
            profile = profiles.get(0);
            profileMapper.updateEntityFromDto(profileDto, profile);
        }

        // Update social links
        profile.getSocialLinks().clear();
        if (profileDto.getSocialLinks() != null) {
            List<SocialLink> socialLinks = profileDto.getSocialLinks().stream()
                .map(dto -> {
                    SocialLink link = socialLinkMapper.toEntity(dto);
                    link.setProfile(profile);
                    return link;
                })
                .collect(Collectors.toList());
            profile.getSocialLinks().addAll(socialLinks);
        }

        Profile updatedProfile = profileRepository.save(profile);
        return profileMapper.toDto(updatedProfile);
    }

    @Override
    public ProfileDto updateAvatar(String profileId, String avatarBase64, String contentType) {
        // Validate avatar data
        avatarValidationService.validateAvatar(avatarBase64, contentType);

        // Get profile - use the first profile if profileId is "default" or not found
        Profile profile;
        if ("default".equals(profileId)) {
            List<Profile> profiles = profileRepository.findAll();
            if (profiles.isEmpty()) {
                throw new ResourceNotFoundException("Profile", "id", profileId);
            }
            profile = profiles.get(0);
        } else {
            profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "id", profileId));
        }

        // Decode and update avatar
        byte[] avatarData = Base64.getDecoder().decode(avatarBase64);
        profile.setAvatarData(avatarData);
        profile.setAvatarContentType(contentType);
        profile.setAvatarFileSize(avatarData.length);
        profile.setAvatarUpdatedAt(LocalDateTime.now());

        // Save and return
        Profile saved = profileRepository.save(profile);
        return profileMapper.toDto(saved);
    }
}
