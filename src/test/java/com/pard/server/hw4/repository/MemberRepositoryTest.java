package com.pard.server.hw4.repository;

import com.pard.server.hw4.entity.Member;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class MemberRepositoryTest {

    @Autowired MemberRepository memberRepository;

    @Test
    public void 회원_성공_추가_로직() throws Exception{
        //given
        Member member = Member.of("test", "testUser","1234");

        //when
        memberRepository.save(member);
        boolean exists = memberRepository.existsByUserName("test");

        //then
        assertTrue(exists);
    }

    @Test
    public void 회원_실패_추가_로직() throws Exception{
        //given
        Member member = Member.of("test", "testUser","1234");

        //when
        memberRepository.save(member);
        boolean exists = memberRepository.existsByUserName("test2");

        //then
        assertFalse(exists);
    }
}