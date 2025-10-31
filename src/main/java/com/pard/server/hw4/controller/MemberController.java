package com.pard.server.hw4.controller;

import com.pard.server.hw4.dto.member.*;
import com.pard.server.hw4.service.MemberService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Member", description = "Member 관련 API")
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("")
    public ResponseEntity<Void> createMember(@RequestBody MemberCreateRequest request){
        memberService.createMember(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<MemberDetailResponse> login(@RequestBody MemberLoginRequest request){
        return ResponseEntity.ok(memberService.login(request));
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
