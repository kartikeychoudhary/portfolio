package com.portfolio.project.repository;

import com.portfolio.project.entity.Project;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ProjectRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void shouldFindAllProjectsOrderedBySort() {
        Project project1 = Project.builder()
                .title("Project A")
                .description("Description A")
                .featured(false)
                .sortOrder(2)
                .build();

        Project project2 = Project.builder()
                .title("Project B")
                .description("Description B")
                .featured(true)
                .sortOrder(1)
                .build();

        Project project3 = Project.builder()
                .title("Project C")
                .description("Description C")
                .featured(false)
                .sortOrder(3)
                .build();

        entityManager.persist(project1);
        entityManager.persist(project2);
        entityManager.persist(project3);
        entityManager.flush();

        List<Project> projects = projectRepository.findAllOrderedBySort();

        assertEquals(3, projects.size());
        assertEquals("Project B", projects.get(0).getTitle());
        assertEquals("Project A", projects.get(1).getTitle());
        assertEquals("Project C", projects.get(2).getTitle());
    }

    @Test
    void shouldFindFeaturedProjects() {
        Project featured1 = Project.builder()
                .title("Featured Project A")
                .description("Description A")
                .featured(true)
                .sortOrder(2)
                .build();

        Project featured2 = Project.builder()
                .title("Featured Project B")
                .description("Description B")
                .featured(true)
                .sortOrder(1)
                .build();

        Project regular = Project.builder()
                .title("Regular Project")
                .description("Description")
                .featured(false)
                .sortOrder(1)
                .build();

        entityManager.persist(featured1);
        entityManager.persist(featured2);
        entityManager.persist(regular);
        entityManager.flush();

        List<Project> featuredProjects = projectRepository.findFeaturedProjects();

        assertEquals(2, featuredProjects.size());
        assertEquals("Featured Project B", featuredProjects.get(0).getTitle());
        assertEquals("Featured Project A", featuredProjects.get(1).getTitle());
    }

    @Test
    void shouldSaveAndRetrieveTechnologies() {
        Project project = Project.builder()
                .title("Full Stack Project")
                .description("A comprehensive project")
                .featured(true)
                .sortOrder(1)
                .build();

        project.setTechnologiesList(Arrays.asList("React", "Node.js", "MongoDB"));

        entityManager.persist(project);
        entityManager.flush();
        entityManager.clear();

        Project found = projectRepository.findById(project.getId()).orElse(null);

        assertNotNull(found);
        List<String> technologies = found.getTechnologiesList();
        assertEquals(3, technologies.size());
        assertTrue(technologies.contains("React"));
        assertTrue(technologies.contains("Node.js"));
        assertTrue(technologies.contains("MongoDB"));
    }
}
