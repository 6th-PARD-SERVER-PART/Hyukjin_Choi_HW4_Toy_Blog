package com.pard.server.hw4.service;

import com.pard.server.hw4.dto.member.MemberCreateRequest;
import com.pard.server.hw4.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private MemberService memberService;

    @Test
    public void 이미_사용중인_아이디일_경우_예외가_발생한다() throws Exception{
        //given
        String existingUserName = "testUser";
        MemberCreateRequest request = new MemberCreateRequest(existingUserName, "displayName", "password1234");

        //when
        when(memberRepository.existsByUserName(existingUserName)).thenReturn(true);

        //then
        assertThrows(RuntimeException.class,
                () -> memberService.createMember(request));
    }

    @Test
    public void 사용중인_아이디가_아닐경우_예외가_발생하지_않는다() throws Exception{
        //given
        String useUserName = "newTestUser";
        MemberCreateRequest request = new MemberCreateRequest(useUserName, "displayName", "password1234");

        //when
        when(memberRepository.existsByUserName(useUserName)).thenReturn(false);

        //then
        assertDoesNotThrow(() -> memberService.createMember(request));
    }
}