package com.pard.server.hw4.repository;

import com.pard.server.hw4.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Long countByPostId(Long postId);
    List<Like> findByPostId(Long postId);
    boolean existsByMemberIdAndPostId(Long memberId, Long postId);
}
