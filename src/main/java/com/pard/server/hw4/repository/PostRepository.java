package com.pard.server.hw4.repository;

import com.pard.server.hw4.entity.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCreatedAtBeforeOrderByCreatedAtDesc(LocalDateTime cursor, Pageable pageable);
}
