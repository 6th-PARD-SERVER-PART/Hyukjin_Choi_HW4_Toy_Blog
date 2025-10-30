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
public class PostUpdateRequest {
    private Long memberId;
    private String title;
    private String content;
}
