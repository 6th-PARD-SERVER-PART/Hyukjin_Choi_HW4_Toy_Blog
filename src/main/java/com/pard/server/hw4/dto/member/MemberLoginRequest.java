package com.pard.server.hw4.dto.member;

import com.pard.server.hw4.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberLoginRequest {
    private String userName;
    private String password;
}