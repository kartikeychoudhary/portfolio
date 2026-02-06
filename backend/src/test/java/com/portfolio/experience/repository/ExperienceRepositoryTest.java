package com.portfolio.experience.repository;

import com.portfolio.experience.entity.Experience;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ExperienceRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Test
    void shouldFindAllExperiencesOrderedBySort() {
        Experience exp1 = Experience.builder()
                .company("Company A")
                .position("Developer")
                .startDate(LocalDate.of(2020, 1, 1))
                .sortOrder(2)
                .build();

        Experience exp2 = Experience.builder()
                .company("Company B")
                .position("Senior Developer")
                .startDate(LocalDate.of(2021, 1, 1))
                .sortOrder(1)
                .build();

        Experience exp3 = Experience.builder()
                .company("Company C")
                .position("Tech Lead")
                .startDate(LocalDate.of(2022, 1, 1))
                .sortOrder(3)
                .build();

        entityManager.persist(exp1);
        entityManager.persist(exp2);
        entityManager.persist(exp3);
        entityManager.flush();

        List<Experience> experiences = experienceRepository.findAllOrderedBySort();

        assertEquals(3, experiences.size());
        assertEquals("Company B", experiences.get(0).getCompany());
        assertEquals("Company A", experiences.get(1).getCompany());
        assertEquals("Company C", experiences.get(2).getCompany());
    }

    @Test
    void shouldFindCurrentExperiences() {
        Experience current1 = Experience.builder()
                .company("Current Company A")
                .position("Developer")
                .startDate(LocalDate.of(2022, 1, 1))
                .endDate(null)
                .build();

        Experience current2 = Experience.builder()
                .company("Current Company B")
                .position("Senior Developer")
                .startDate(LocalDate.of(2023, 1, 1))
                .endDate(null)
                .build();

        Experience past = Experience.builder()
                .company("Past Company")
                .position("Junior Developer")
                .startDate(LocalDate.of(2020, 1, 1))
                .endDate(LocalDate.of(2021, 12, 31))
                .build();

        entityManager.persist(current1);
        entityManager.persist(current2);
        entityManager.persist(past);
        entityManager.flush();

        List<Experience> currentExperiences = experienceRepository.findCurrentExperiences();

        assertEquals(2, currentExperiences.size());
        assertEquals("Current Company B", currentExperiences.get(0).getCompany());
        assertEquals("Current Company A", currentExperiences.get(1).getCompany());
    }

    @Test
    void shouldSaveAndRetrieveTechnologies() {
        Experience experience = Experience.builder()
                .company("Tech Company")
                .position("Full Stack Developer")
                .startDate(LocalDate.of(2021, 1, 1))
                .build();

        experience.setTechnologiesList(Arrays.asList("Java", "Spring Boot", "React"));

        entityManager.persist(experience);
        entityManager.flush();
        entityManager.clear();

        Experience found = experienceRepository.findById(experience.getId()).orElse(null);

        assertNotNull(found);
        List<String> technologies = found.getTechnologiesList();
        assertEquals(3, technologies.size());
        assertTrue(technologies.contains("Java"));
        assertTrue(technologies.contains("Spring Boot"));
        assertTrue(technologies.contains("React"));
    }
}
