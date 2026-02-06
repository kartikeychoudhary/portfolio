package com.portfolio.blog.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.blog.dto.BlogDto;
import com.portfolio.blog.service.BlogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BlogController.class)
class BlogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BlogService blogService;

    @Test
    void shouldGetPublishedBlogsWithoutAuthentication() throws Exception {
        List<BlogDto> blogs = Arrays.asList(
                BlogDto.builder()
                        .id("1")
                        .title("Blog A")
                        .slug("blog-a")
                        .excerpt("Excerpt A")
                        .content("Content A")
                        .published(true)
                        .tags(Arrays.asList("Java", "Spring"))
                        .build(),
                BlogDto.builder()
                        .id("2")
                        .title("Blog B")
                        .slug("blog-b")
                        .content("Content B")
                        .published(true)
                        .build()
        );

        when(blogService.getPublishedBlogs()).thenReturn(blogs);

        mockMvc.perform(get("/api/blogs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].title").value("Blog A"))
                .andExpect(jsonPath("$[1].id").value("2"))
                .andExpect(jsonPath("$[1].title").value("Blog B"));

        verify(blogService).getPublishedBlogs();
    }

    @Test
    void shouldGetBlogBySlug() throws Exception {
        BlogDto blog = BlogDto.builder()
                .id("1")
                .title("Test Blog")
                .slug("test-blog")
                .content("Test Content")
                .published(true)
                .publishedDate(LocalDateTime.now())
                .build();

        when(blogService.getBlogBySlug("test-blog")).thenReturn(blog);

        mockMvc.perform(get("/api/blogs/test-blog"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.slug").value("test-blog"))
                .andExpect(jsonPath("$.title").value("Test Blog"));

        verify(blogService).getBlogBySlug("test-blog");
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldCreateBlogWithAdminRole() throws Exception {
        BlogDto blogDto = BlogDto.builder()
                .title("New Blog")
                .slug("new-blog")
                .content("New Content")
                .published(true)
                .tags(Arrays.asList("Java", "Spring Boot"))
                .build();

        BlogDto savedBlogDto = BlogDto.builder()
                .id("1")
                .title("New Blog")
                .slug("new-blog")
                .content("New Content")
                .published(true)
                .tags(Arrays.asList("Java", "Spring Boot"))
                .build();

        when(blogService.createBlog(any(BlogDto.class))).thenReturn(savedBlogDto);

        mockMvc.perform(post("/api/blogs")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(blogDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.title").value("New Blog"));

        verify(blogService).createBlog(any(BlogDto.class));
    }

    @Test
    void shouldReturn401WhenCreatingBlogWithoutAuth() throws Exception {
        BlogDto blogDto = BlogDto.builder()
                .title("New Blog")
                .slug("new-blog")
                .content("New Content")
                .published(true)
                .build();

        mockMvc.perform(post("/api/blogs")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(blogDto)))
                .andExpect(status().isUnauthorized());

        verify(blogService, never()).createBlog(any(BlogDto.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldUpdateBlogWithAdminRole() throws Exception {
        BlogDto blogDto = BlogDto.builder()
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

        when(blogService.updateBlog(eq("1"), any(BlogDto.class))).thenReturn(updatedBlogDto);

        mockMvc.perform(put("/api/blogs/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(blogDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Blog"))
                .andExpect(jsonPath("$.content").value("Updated Content"));

        verify(blogService).updateBlog(eq("1"), any(BlogDto.class));
    }

    @Test
    @WithMockUser(roles = "admin")
    void shouldDeleteBlogWithAdminRole() throws Exception {
        doNothing().when(blogService).deleteBlog("1");

        mockMvc.perform(delete("/api/blogs/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());

        verify(blogService).deleteBlog("1");
    }
}
