package com.portfolio.blog.repository;

import com.portfolio.blog.entity.Blog;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class BlogRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private BlogRepository blogRepository;

    @Test
    void shouldFindBlogBySlug() {
        Blog blog = Blog.builder()
                .title("Test Blog")
                .slug("test-blog")
                .content("This is test content")
                .published(true)
                .publishedDate(LocalDateTime.now())
                .build();

        entityManager.persist(blog);
        entityManager.flush();

        Optional<Blog> found = blogRepository.findBySlug("test-blog");

        assertTrue(found.isPresent());
        assertEquals("Test Blog", found.get().getTitle());
        assertEquals("test-blog", found.get().getSlug());
    }

    @Test
    void shouldFindPublishedBlogs() {
        Blog published1 = Blog.builder()
                .title("Published Blog 1")
                .slug("published-blog-1")
                .content("Content 1")
                .published(true)
                .publishedDate(LocalDateTime.now().minusDays(2))
                .build();

        Blog published2 = Blog.builder()
                .title("Published Blog 2")
                .slug("published-blog-2")
                .content("Content 2")
                .published(true)
                .publishedDate(LocalDateTime.now().minusDays(1))
                .build();

        Blog draft = Blog.builder()
                .title("Draft Blog")
                .slug("draft-blog")
                .content("Draft Content")
                .published(false)
                .build();

        entityManager.persist(published1);
        entityManager.persist(published2);
        entityManager.persist(draft);
        entityManager.flush();

        List<Blog> publishedBlogs = blogRepository.findPublishedBlogs();

        assertEquals(2, publishedBlogs.size());
        assertEquals("Published Blog 2", publishedBlogs.get(0).getTitle());
        assertEquals("Published Blog 1", publishedBlogs.get(1).getTitle());
    }

    @Test
    void shouldSaveAndRetrieveTags() {
        Blog blog = Blog.builder()
                .title("Tagged Blog")
                .slug("tagged-blog")
                .content("Content with tags")
                .published(true)
                .build();

        blog.setTagsList(Arrays.asList("Java", "Spring Boot", "REST API"));

        entityManager.persist(blog);
        entityManager.flush();
        entityManager.clear();

        Blog found = blogRepository.findById(blog.getId()).orElse(null);

        assertNotNull(found);
        List<String> tags = found.getTagsList();
        assertEquals(3, tags.size());
        assertTrue(tags.contains("Java"));
        assertTrue(tags.contains("Spring Boot"));
        assertTrue(tags.contains("REST API"));
    }
}
