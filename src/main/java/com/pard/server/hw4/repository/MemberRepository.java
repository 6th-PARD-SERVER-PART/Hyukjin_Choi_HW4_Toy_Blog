package com.pard.server.hw4.repository;

import com.pard.server.hw4.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByUserName(String userName);
    Optional<Member> findByUserName(String userName);
}
