package com.portfolio.profile.repository;

import com.portfolio.profile.entity.Profile;
import com.portfolio.profile.entity.SocialLink;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class SocialLinkRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SocialLinkRepository socialLinkRepository;

    @Test
    void shouldFindByProfileIdOrderedBySort() {
        Profile profile = Profile.builder()
                .fullName("John Doe")
                .title("Developer")
                .email("john@example.com")
                .build();

        SocialLink link1 = SocialLink.builder()
                .platform("LinkedIn")
                .url("https://linkedin.com/in/johndoe")
                .sortOrder(2)
                .build();

        SocialLink link2 = SocialLink.builder()
                .platform("GitHub")
                .url("https://github.com/johndoe")
                .sortOrder(1)
                .build();

        SocialLink link3 = SocialLink.builder()
                .platform("Twitter")
                .url("https://twitter.com/johndoe")
                .sortOrder(3)
                .build();

        profile.addSocialLink(link1);
        profile.addSocialLink(link2);
        profile.addSocialLink(link3);

        entityManager.persist(profile);
        entityManager.flush();

        List<SocialLink> socialLinks = socialLinkRepository.findByProfileIdOrderedBySort(profile.getId());

        assertEquals(3, socialLinks.size());
        assertEquals("GitHub", socialLinks.get(0).getPlatform());
        assertEquals("LinkedIn", socialLinks.get(1).getPlatform());
        assertEquals("Twitter", socialLinks.get(2).getPlatform());
    }
}
