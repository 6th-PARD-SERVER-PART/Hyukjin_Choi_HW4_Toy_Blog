package com.pard.server.hw4.dto.post;

import com.pard.server.hw4.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateRequest {
    private Long memberId;
    private String title;
    private String content;

    public static Post toEntity(PostCreateRequest request) {
        return Post.builder()
                .memberId(request.getMemberId())
                .title(request.getTitle())
                .content(request.getContent())
                .build();
    }
}
