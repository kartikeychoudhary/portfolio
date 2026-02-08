package com.portfolio.profile.service;

import com.portfolio.profile.dto.ProfileDto;

public interface ProfileService {
    ProfileDto getProfile();
    ProfileDto updateProfile(ProfileDto profileDto);
    ProfileDto updateAvatar(String profileId, String avatarBase64, String contentType);
    ProfileDto updateResume(String profileId, String resumeBase64, String contentType);
}
