package com.pard.server.hw4.dto.member;

import com.pard.server.hw4.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberDetailResponse {
    private Long id;
    private String userName;
    private String displayName;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static MemberDetailResponse fromEntity(Member member){
        return MemberDetailResponse.builder()
                .id(member.getId())
                .userName(member.getUserName())
                .displayName(member.getDisplayName())
                .createdAt(member.getCreatedAt())
                .modifiedAt(member.getModifiedAt())
                .build();
    }
}
