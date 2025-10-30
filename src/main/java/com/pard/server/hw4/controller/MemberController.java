package com.pard.server.hw4.controller;

import com.pard.server.hw4.dto.member.MemberCreateRequest;
import com.pard.server.hw4.dto.member.MemberDetailResponse;
import com.pard.server.hw4.dto.member.MemberDisplayNameUpdateRequest;
import com.pard.server.hw4.dto.member.MemberRequest;
import com.pard.server.hw4.service.MemberService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Member", description = "Member 관련 API")
@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("")
    public ResponseEntity<Void> createMember(@RequestBody MemberCreateRequest request){
        memberService.createMember(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/updateName")
    public ResponseEntity<Void> updateMemberDisplayName(@RequestBody MemberDisplayNameUpdateRequest request) {
        memberService.updateMemberDisplayName(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("")
    public ResponseEntity<Void> deleteMember(@RequestBody MemberRequest request) {
        memberService.deleteMember(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("")
    public ResponseEntity<MemberDetailResponse> getMemberInfo (@RequestBody MemberRequest request) {
        memberService.getMemberInfo(request);
        return ResponseEntity.ok().build();
    }
}
