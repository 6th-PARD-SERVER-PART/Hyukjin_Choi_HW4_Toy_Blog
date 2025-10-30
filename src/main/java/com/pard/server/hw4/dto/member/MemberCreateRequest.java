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
public class MemberCreateRequest {
    private String userName;
    private String displayName;
    private String password;

    public static Member toEntity(MemberCreateRequest request){
        return Member.of(
                request.getUserName(),
                request.getDisplayName(),
                request.getPassword()
        );
    }
}
