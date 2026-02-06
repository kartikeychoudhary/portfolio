package com.portfolio.project.repository;

import com.portfolio.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {

    @Query(name = "Project.findAllOrderedBySort")
    List<Project> findAllOrderedBySort();

    @Query(name = "Project.findFeaturedProjects")
    List<Project> findFeaturedProjects();
}
