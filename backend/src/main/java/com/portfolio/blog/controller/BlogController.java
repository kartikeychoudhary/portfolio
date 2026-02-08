package com.portfolio.blog.controller;

import com.portfolio.blog.dto.BlogDto;
import com.portfolio.blog.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping
    public ResponseEntity<List<BlogDto>> getPublishedBlogs() {
        List<BlogDto> blogs = blogService.getPublishedBlogs();
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<BlogDto>> getAllBlogs() {
        List<BlogDto> blogs = blogService.getAllBlogs();
        return ResponseEntity.ok(blogs);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogDto> getBlogBySlug(@PathVariable String slug) {
        BlogDto blog = blogService.getBlogBySlug(slug);
        return ResponseEntity.ok(blog);
    }

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<BlogDto> createBlog(@Valid @RequestBody BlogDto blogDto) {
        BlogDto createdBlog = blogService.createBlog(blogDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBlog);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<BlogDto> updateBlog(@PathVariable String id, @Valid @RequestBody BlogDto blogDto) {
        BlogDto updatedBlog = blogService.updateBlog(id, blogDto);
        return ResponseEntity.ok(updatedBlog);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteBlog(@PathVariable String id) {
        blogService.deleteBlog(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/cover-image")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<BlogDto> uploadCoverImage(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        String base64Data = request.get("imageBase64");
        String contentType = request.get("contentType");
        BlogDto updatedBlog = blogService.uploadCoverImage(id, base64Data, contentType);
        return ResponseEntity.ok(updatedBlog);
    }

    @GetMapping("/{id}/cover-image")
    public ResponseEntity<byte[]> getCoverImage(@PathVariable String id) {
        byte[] imageData = blogService.getCoverImageData(id);
        String contentType = blogService.getCoverImageContentType(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setCacheControl(CacheControl.maxAge(java.time.Duration.ofDays(7)).cachePublic());

        return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
    }
}
