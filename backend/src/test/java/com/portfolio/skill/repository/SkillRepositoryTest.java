package com.portfolio.skill.repository;

import com.portfolio.skill.entity.Skill;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class SkillRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SkillRepository skillRepository;

    @Test
    void shouldFindSkillsByCategory() {
        Skill skill1 = Skill.builder()
                .name("Angular")
                .icon("fa-brands fa-angular")
                .category("frontend")
                .proficiency(90)
                .sortOrder(1)
                .build();
        Skill skill2 = Skill.builder()
                .name("React")
                .icon("fa-brands fa-react")
                .category("frontend")
                .proficiency(85)
                .sortOrder(2)
                .build();
        Skill skill3 = Skill.builder()
                .name("Spring Boot")
                .icon("fa-brands fa-java")
                .category("backend")
                .proficiency(88)
                .sortOrder(1)
                .build();

        entityManager.persist(skill1);
        entityManager.persist(skill2);
        entityManager.persist(skill3);
        entityManager.flush();

        List<Skill> frontendSkills = skillRepository.findByCategory("frontend");

        assertEquals(2, frontendSkills.size());
        assertEquals("Angular", frontendSkills.get(0).getName());
        assertEquals("React", frontendSkills.get(1).getName());
    }

    @Test
    void shouldFindAllSkillsOrderedBySort() {
        Skill skill1 = Skill.builder()
                .name("Angular")
                .category("frontend")
                .proficiency(90)
                .sortOrder(2)
                .build();
        Skill skill2 = Skill.builder()
                .name("React")
                .category("frontend")
                .proficiency(85)
                .sortOrder(1)
                .build();
        Skill skill3 = Skill.builder()
                .name("Spring Boot")
                .category("backend")
                .proficiency(88)
                .sortOrder(3)
                .build();

        entityManager.persist(skill1);
        entityManager.persist(skill2);
        entityManager.persist(skill3);
        entityManager.flush();

        List<Skill> skills = skillRepository.findAllOrderedBySort();

        assertEquals(3, skills.size());
        assertEquals("React", skills.get(0).getName());
        assertEquals("Angular", skills.get(1).getName());
        assertEquals("Spring Boot", skills.get(2).getName());
    }
}
