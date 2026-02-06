package com.portfolio.skill.repository;

import com.portfolio.skill.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, String> {

    @Query(name = "Skill.findByCategory")
    List<Skill> findByCategory(@Param("category") String category);

    @Query(name = "Skill.findAllOrderedBySort")
    List<Skill> findAllOrderedBySort();
}
