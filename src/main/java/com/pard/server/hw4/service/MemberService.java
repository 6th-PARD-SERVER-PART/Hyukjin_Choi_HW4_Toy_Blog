package com.pard.server.hw4.service;

import com.pard.server.hw4.dto.member.*;
import com.pard.server.hw4.entity.Member;
import com.pard.server.hw4.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {


    private final MemberRepository memberRepository;

    public void createMember(MemberCreateRequest request) {
        validateMember(request.getUserName());

        Member member = MemberCreateRequest.toEntity(request);

        memberRepository.save(member);
    }

    private void validateMember(String userName){
        if(memberRepository.existsByUserName(userName)){
            throw new RuntimeException("이미 사용중인 아이디 입니다.");
        }
    }

    public MemberDetailResponse login(MemberLoginRequest request) {
        System.out.println("로그인 호출");
        Member member = memberRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new EntityNotFoundException("Member Not Found"));

        System.out.println("Member Name: " + member.getUserName());
        System.out.println("Member Password: " + member.getPassword());
        System.out.println("Input Password: " + request.getPassword());

        if(member.getPassword().equals(request.getPassword())){
            return MemberDetailResponse.fromEntity(member);
        } else {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다.");
        }
    }

    public void updateMemberDisplayName(MemberDisplayNameUpdateRequest request) {
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new EntityNotFoundException("Member Not Found"));

        member.updateDisplayName(request.getDisplayName());
    }

    public void deleteMember(MemberRequest request){
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new EntityNotFoundException("Member Not Found"));

        memberRepository.delete(member);
    }

    public MemberDetailResponse getMemberInfo(MemberRequest request){
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new EntityNotFoundException("Member Not Found"));

        return MemberDetailResponse.fromEntity(member);
    }
}
