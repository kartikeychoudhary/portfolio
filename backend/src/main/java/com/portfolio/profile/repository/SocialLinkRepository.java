package com.portfolio.profile.repository;

import com.portfolio.profile.entity.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SocialLinkRepository extends JpaRepository<SocialLink, String> {

    @Query(name = "SocialLink.findByProfileIdOrderedBySort")
    List<SocialLink> findByProfileIdOrderedBySort(@Param("profileId") String profileId);
}
