package com.portfolio.blog.repository;

import com.portfolio.blog.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, String> {

    @Query(name = "Blog.findBySlug")
    Optional<Blog> findBySlug(@Param("slug") String slug);

    @Query(name = "Blog.findPublishedBlogs")
    List<Blog> findPublishedBlogs();
}
