package com.pard.server.hw4.service;

import com.pard.server.hw4.dto.member.MemberCreateRequest;
import com.pard.server.hw4.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {


    private final MemberRepository memberRepository;

    public void createMember(MemberCreateRequest request) {
        validateMember(request.getUserName());
    }


    private void validateMember(String userName){
        if(memberRepository.existsByUserName(userName)){
            throw new RuntimeException("이미 사용중인 아이디 입니다.");
        }
    }
}
