package com.portfolio.experience.repository;

import com.portfolio.experience.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, String> {

    @Query(name = "Experience.findAllOrderedBySort")
    List<Experience> findAllOrderedBySort();

    @Query(name = "Experience.findCurrentExperiences")
    List<Experience> findCurrentExperiences();
}
