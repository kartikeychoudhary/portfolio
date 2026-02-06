package com.portfolio.blog.service;

import com.portfolio.blog.dto.BlogDto;
import com.portfolio.blog.dto.BlogMapper;
import com.portfolio.blog.entity.Blog;
import com.portfolio.blog.repository.BlogRepository;
import com.portfolio.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;

    @Autowired
    public BlogServiceImpl(BlogRepository blogRepository, BlogMapper blogMapper) {
        this.blogRepository = blogRepository;
        this.blogMapper = blogMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogDto> getAllBlogs() {
        List<Blog> blogs = blogRepository.findAll();
        return blogMapper.toDtoList(blogs);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogDto getBlogById(String id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));
        return blogMapper.toDto(blog);
    }

    @Override
    @Transactional(readOnly = true)
    public BlogDto getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "slug", slug));
        return blogMapper.toDto(blog);
    }

    @Override
    public BlogDto createBlog(BlogDto blogDto) {
        Blog blog = blogMapper.toEntity(blogDto);
        Blog savedBlog = blogRepository.save(blog);
        return blogMapper.toDto(savedBlog);
    }

    @Override
    public BlogDto updateBlog(String id, BlogDto blogDto) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));

        blogMapper.updateEntityFromDto(blogDto, blog);
        Blog updatedBlog = blogRepository.save(blog);
        return blogMapper.toDto(updatedBlog);
    }

    @Override
    public void deleteBlog(String id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog", "id", id));
        blogRepository.delete(blog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogDto> getPublishedBlogs() {
        List<Blog> blogs = blogRepository.findPublishedBlogs();
        return blogMapper.toDtoList(blogs);
    }
}
