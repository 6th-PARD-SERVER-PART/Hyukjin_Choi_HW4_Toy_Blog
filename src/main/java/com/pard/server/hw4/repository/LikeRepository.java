package com.pard.server.hw4.repository;

import com.pard.server.hw4.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
}
