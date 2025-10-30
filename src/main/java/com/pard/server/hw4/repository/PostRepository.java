package com.pard.server.hw4.repository;

import com.pard.server.hw4.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
