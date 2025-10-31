package com.pard.server.hw4.dto.like;

import com.pard.server.hw4.entity.Like;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LikeResponse {
    private Long id;
    private Long memberId;

    public static LikeResponse fromEntity(Like like) {
        return LikeResponse.builder()
                .id(like.getId())
                .memberId(like.getMemberId())
                .build();
    }
}
