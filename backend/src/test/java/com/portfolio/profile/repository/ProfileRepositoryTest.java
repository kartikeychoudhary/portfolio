package com.portfolio.profile.repository;

import com.portfolio.profile.entity.Profile;
import com.portfolio.profile.entity.SocialLink;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ProfileRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProfileRepository profileRepository;

    @Test
    void shouldSaveAndFindProfile() {
        Profile profile = Profile.builder()
                .fullName("John Doe")
                .title("Full Stack Developer")
                .bio("Experienced developer")
                .email("john@example.com")
                .phone("+1234567890")
                .location("New York, USA")
                .avatarUrl("https://example.com/avatar.jpg")
                .resumeUrl("https://example.com/resume.pdf")
                .build();

        entityManager.persist(profile);
        entityManager.flush();

        Optional<Profile> foundProfile = profileRepository.findById(profile.getId());

        assertTrue(foundProfile.isPresent());
        assertEquals("John Doe", foundProfile.get().getFullName());
        assertEquals("Full Stack Developer", foundProfile.get().getTitle());
        assertEquals("john@example.com", foundProfile.get().getEmail());
    }

    @Test
    void shouldSaveProfileWithSocialLinks() {
        Profile profile = Profile.builder()
                .fullName("John Doe")
                .title("Full Stack Developer")
                .email("john@example.com")
                .build();

        SocialLink link1 = SocialLink.builder()
                .platform("GitHub")
                .url("https://github.com/johndoe")
                .icon("fa-brands fa-github")
                .sortOrder(1)
                .build();

        SocialLink link2 = SocialLink.builder()
                .platform("LinkedIn")
                .url("https://linkedin.com/in/johndoe")
                .icon("fa-brands fa-linkedin")
                .sortOrder(2)
                .build();

        profile.addSocialLink(link1);
        profile.addSocialLink(link2);

        entityManager.persist(profile);
        entityManager.flush();

        Optional<Profile> foundProfile = profileRepository.findById(profile.getId());

        assertTrue(foundProfile.isPresent());
        assertEquals(2, foundProfile.get().getSocialLinks().size());
    }

    @Test
    void shouldDeleteSocialLinksWhenProfileDeleted() {
        Profile profile = Profile.builder()
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .build();

        SocialLink link = SocialLink.builder()
                .platform("GitHub")
                .url("https://github.com/johndoe")
                .sortOrder(1)
                .build();

        profile.addSocialLink(link);

        entityManager.persist(profile);
        entityManager.flush();
        entityManager.clear();

        profileRepository.deleteById(profile.getId());
        entityManager.flush();

        Optional<Profile> deletedProfile = profileRepository.findById(profile.getId());
        assertFalse(deletedProfile.isPresent());
    }
}
