package com.portfolio.blog.service;

import com.portfolio.blog.dto.BlogDto;
import com.portfolio.blog.dto.BlogMapper;
import com.portfolio.blog.entity.Blog;
import com.portfolio.blog.repository.BlogRepository;
import com.portfolio.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlogServiceTest {

    @Mock
    private BlogRepository blogRepository;

    @Mock
    private BlogMapper blogMapper;

    private BlogServiceImpl blogService;

    @BeforeEach
    void setUp() {
        blogService = new BlogServiceImpl(blogRepository, blogMapper);
    }

    @Test
    void shouldGetAllBlogs() {
        List<Blog> blogs = Arrays.asList(
                Blog.builder().id("1").title("Blog A").slug("blog-a").content("Content A").published(false).build(),
                Blog.builder().id("2").title("Blog B").slug("blog-b").content("Content B").published(false).build()
        );
        List<BlogDto> blogDtos = Arrays.asList(
                BlogDto.builder().id("1").title("Blog A").slug("blog-a").content("Content A").published(false).build(),
                BlogDto.builder().id("2").title("Blog B").slug("blog-b").content("Content B").published(false).build()
        );

        when(blogRepository.findAll()).thenReturn(blogs);
        when(blogMapper.toDtoList(blogs)).thenReturn(blogDtos);

        List<BlogDto> result = blogService.getAllBlogs();

        assertEquals(2, result.size());
        verify(blogRepository).findAll();
        verify(blogMapper).toDtoList(blogs);
    }

    @Test
    void shouldGetBlogById() {
        Blog blog = Blog.builder()
                .id("1")
                .title("Blog A")
                .slug("blog-a")
                .content("Content A")
                .published(true)
                .build();
        BlogDto blogDto = BlogDto.builder()
                .id("1")
                .title("Blog A")
                .slug("blog-a")
                .content("Content A")
                .published(true)
                .build();

        when(blogRepository.findById("1")).thenReturn(Optional.of(blog));
        when(blogMapper.toDto(blog)).thenReturn(blogDto);

        BlogDto result = blogService.getBlogById("1");

        assertEquals("1", result.getId());
        assertEquals("Blog A", result.getTitle());
        verify(blogRepository).findById("1");
        verify(blogMapper).toDto(blog);
    }

    @Test
    void shouldGetBlogBySlug() {
        Blog blog = Blog.builder()
                .id("1")
                .title("Blog A")
                .slug("blog-a")
                .content("Content A")
                .published(true)
                .build();
        BlogDto blogDto = BlogDto.builder()
                .id("1")
                .title("Blog A")
                .slug("blog-a")
                .content("Content A")
                .published(true)
                .build();

        when(blogRepository.findBySlug("blog-a")).thenReturn(Optional.of(blog));
        when(blogMapper.toDto(blog)).thenReturn(blogDto);

        BlogDto result = blogService.getBlogBySlug("blog-a");

        assertEquals("blog-a", result.getSlug());
        assertEquals("Blog A", result.getTitle());
        verify(blogRepository).findBySlug("blog-a");
        verify(blogMapper).toDto(blog);
    }

    @Test
    void shouldThrowExceptionWhenBlogNotFoundById() {
        when(blogRepository.findById("999")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            blogService.getBlogById("999");
        });

        verify(blogRepository).findById("999");
    }

    @Test
    void shouldThrowExceptionWhenBlogNotFoundBySlug() {
        when(blogRepository.findBySlug("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            blogService.getBlogBySlug("non-existent");
        });

        verify(blogRepository).findBySlug("non-existent");
    }

    @Test
    void shouldCreateBlog() {
        BlogDto blogDto = BlogDto.builder()
                .title("New Blog")
                .slug("new-blog")
                .content("New Content")
                .published(true)
                .tags(Arrays.asList("Java", "Spring"))
                .build();

        Blog blog = Blog.builder()
                .title("New Blog")
                .slug("new-blog")
                .content("New Content")
                .published(true)
                .build();

        Blog savedBlog = Blog.builder()
                .id("1")
                .title("New Blog")
                .slug("new-blog")
                .content("New Content")
                .published(true)
                .build();

        BlogDto savedBlogDto = BlogDto.builder()
                .id("1")
                .title("New Blog")
                .slug("new-blog")
                .content("New Content")
                .published(true)
                .tags(Arrays.asList("Java", "Spring"))
                .build();

        when(blogMapper.toEntity(blogDto)).thenReturn(blog);
        when(blogRepository.save(blog)).thenReturn(savedBlog);
        when(blogMapper.toDto(savedBlog)).thenReturn(savedBlogDto);

        BlogDto result = blogService.createBlog(blogDto);

        assertNotNull(result.getId());
        assertEquals("New Blog", result.getTitle());
        verify(blogMapper).toEntity(blogDto);
        verify(blogRepository).save(blog);
        verify(blogMapper).toDto(savedBlog);
    }

    @Test
    void shouldUpdateBlog() {
        BlogDto blogDto = BlogDto.builder()
                .title("Updated Blog")
                .slug("updated-blog")
                .content("Updated Content")
                .published(true)
                .build();

        Blog existingBlog = Blog.builder()
                .id("1")
                .title("Original Blog")
                .slug("original-blog")
                .content("Original Content")
                .published(false)
                .build();

        Blog updatedBlog = Blog.builder()
                .id("1")
                .title("Updated Blog")
                .slug("updated-blog")
                .content("Updated Content")
                .published(true)
                .build();

        BlogDto updatedBlogDto = BlogDto.builder()
                .id("1")
                .title("Updated Blog")
                .slug("updated-blog")
                .content("Updated Content")
                .published(true)
                .build();

        when(blogRepository.findById("1")).thenReturn(Optional.of(existingBlog));
        when(blogRepository.save(existingBlog)).thenReturn(updatedBlog);
        when(blogMapper.toDto(updatedBlog)).thenReturn(updatedBlogDto);

        BlogDto result = blogService.updateBlog("1", blogDto);

        assertEquals("Updated Blog", result.getTitle());
        assertEquals("Updated Content", result.getContent());
        verify(blogRepository).findById("1");
        verify(blogMapper).updateEntityFromDto(blogDto, existingBlog);
        verify(blogRepository).save(existingBlog);
        verify(blogMapper).toDto(updatedBlog);
    }

    @Test
    void shouldDeleteBlog() {
        Blog blog = Blog.builder()
                .id("1")
                .title("Blog A")
                .slug("blog-a")
                .content("Content A")
                .published(true)
                .build();

        when(blogRepository.findById("1")).thenReturn(Optional.of(blog));
        doNothing().when(blogRepository).delete(blog);

        blogService.deleteBlog("1");

        verify(blogRepository).findById("1");
        verify(blogRepository).delete(blog);
    }

    @Test
    void shouldGetPublishedBlogs() {
        List<Blog> blogs = Arrays.asList(
                Blog.builder().id("1").title("Published Blog A").slug("published-a").content("Content A").published(true).build(),
                Blog.builder().id("2").title("Published Blog B").slug("published-b").content("Content B").published(true).build()
        );
        List<BlogDto> blogDtos = Arrays.asList(
                BlogDto.builder().id("1").title("Published Blog A").slug("published-a").content("Content A").published(true).build(),
                BlogDto.builder().id("2").title("Published Blog B").slug("published-b").content("Content B").published(true).build()
        );

        when(blogRepository.findPublishedBlogs()).thenReturn(blogs);
        when(blogMapper.toDtoList(blogs)).thenReturn(blogDtos);

        List<BlogDto> result = blogService.getPublishedBlogs();

        assertEquals(2, result.size());
        verify(blogRepository).findPublishedBlogs();
        verify(blogMapper).toDtoList(blogs);
    }
}
