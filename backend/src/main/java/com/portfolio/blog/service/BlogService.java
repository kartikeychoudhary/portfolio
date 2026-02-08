package com.portfolio.blog.service;

import com.portfolio.blog.dto.BlogDto;

import java.util.List;

public interface BlogService {
    List<BlogDto> getAllBlogs();
    BlogDto getBlogById(String id);
    BlogDto getBlogBySlug(String slug);
    BlogDto createBlog(BlogDto blogDto);
    BlogDto updateBlog(String id, BlogDto blogDto);
    void deleteBlog(String id);
    List<BlogDto> getPublishedBlogs();
    BlogDto uploadCoverImage(String id, String base64Data, String contentType);
    byte[] getCoverImageData(String id);
    String getCoverImageContentType(String id);
}
