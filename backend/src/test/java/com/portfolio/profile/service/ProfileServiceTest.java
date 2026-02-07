package com.portfolio.profile.service;

import com.portfolio.common.exception.ResourceNotFoundException;
import com.portfolio.profile.dto.ProfileDto;
import com.portfolio.profile.dto.ProfileMapper;
import com.portfolio.profile.dto.SocialLinkDto;
import com.portfolio.profile.dto.SocialLinkMapper;
import com.portfolio.profile.entity.Profile;
import com.portfolio.profile.entity.SocialLink;
import com.portfolio.profile.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private ProfileMapper profileMapper;

    @Mock
    private SocialLinkMapper socialLinkMapper;

    @Mock
    private AvatarValidationService avatarValidationService;

    private ProfileServiceImpl profileService;

    @BeforeEach
    void setUp() {
        profileService = new ProfileServiceImpl(profileRepository, profileMapper, socialLinkMapper, avatarValidationService);
    }

    @Test
    void shouldGetProfile() {
        Profile profile = Profile.builder()
                .id("1")
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .build();

        ProfileDto profileDto = ProfileDto.builder()
                .id("1")
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .build();

        when(profileRepository.findAll()).thenReturn(Collections.singletonList(profile));
        when(profileMapper.toDto(profile)).thenReturn(profileDto);

        ProfileDto result = profileService.getProfile();

        assertEquals("John Doe", result.getFullName());
        assertEquals("Developer", result.getTitle());
        verify(profileRepository).findAll();
        verify(profileMapper).toDto(profile);
    }

    @Test
    void shouldThrowExceptionWhenNoProfileExists() {
        when(profileRepository.findAll()).thenReturn(Collections.emptyList());

        assertThrows(ResourceNotFoundException.class, () -> {
            profileService.getProfile();
        });

        verify(profileRepository).findAll();
    }

    @Test
    void shouldUpdateExistingProfile() {
        ProfileDto profileDto = ProfileDto.builder()
                .fullName("John Doe Updated")
                .title("Senior Developer")
                .email("john@example.com")
                .socialLinks(Arrays.asList(
                    SocialLinkDto.builder()
                        .platform("GitHub")
                        .url("https://github.com/johndoe")
                        .sortOrder(1)
                        .build()
                ))
                .build();

        Profile existingProfile = Profile.builder()
                .id("1")
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .socialLinks(new ArrayList<>())
                .build();

        Profile updatedProfile = Profile.builder()
                .id("1")
                .fullName("John Doe Updated")
                .title("Senior Developer")
                .email("john@example.com")
                .socialLinks(new ArrayList<>())
                .build();

        ProfileDto updatedProfileDto = ProfileDto.builder()
                .id("1")
                .fullName("John Doe Updated")
                .title("Senior Developer")
                .email("john@example.com")
                .build();

        SocialLink socialLink = SocialLink.builder()
                .platform("GitHub")
                .url("https://github.com/johndoe")
                .sortOrder(1)
                .build();

        when(profileRepository.findAll()).thenReturn(Collections.singletonList(existingProfile));
        when(socialLinkMapper.toEntity(any(SocialLinkDto.class))).thenReturn(socialLink);
        when(profileRepository.save(any(Profile.class))).thenReturn(updatedProfile);
        when(profileMapper.toDto(updatedProfile)).thenReturn(updatedProfileDto);

        ProfileDto result = profileService.updateProfile(profileDto);

        assertEquals("John Doe Updated", result.getFullName());
        assertEquals("Senior Developer", result.getTitle());
        verify(profileRepository).findAll();
        verify(profileMapper).updateEntityFromDto(profileDto, existingProfile);
        verify(profileRepository).save(any(Profile.class));
        verify(profileMapper).toDto(updatedProfile);
    }

    @Test
    void shouldCreateNewProfileWhenNoneExists() {
        ProfileDto profileDto = ProfileDto.builder()
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .build();

        Profile profile = Profile.builder()
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .socialLinks(new ArrayList<>())
                .build();

        Profile savedProfile = Profile.builder()
                .id("1")
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .socialLinks(new ArrayList<>())
                .build();

        ProfileDto savedProfileDto = ProfileDto.builder()
                .id("1")
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .build();

        when(profileRepository.findAll()).thenReturn(Collections.emptyList());
        when(profileMapper.toEntity(profileDto)).thenReturn(profile);
        when(profileRepository.save(any(Profile.class))).thenReturn(savedProfile);
        when(profileMapper.toDto(savedProfile)).thenReturn(savedProfileDto);

        ProfileDto result = profileService.updateProfile(profileDto);

        assertNotNull(result.getId());
        assertEquals("John Doe", result.getFullName());
        verify(profileRepository).findAll();
        verify(profileMapper).toEntity(profileDto);
        verify(profileRepository).save(any(Profile.class));
        verify(profileMapper).toDto(savedProfile);
    }
}
