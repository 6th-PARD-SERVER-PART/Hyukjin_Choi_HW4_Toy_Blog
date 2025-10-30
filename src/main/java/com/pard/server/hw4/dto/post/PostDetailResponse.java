package com.pard.server.hw4.dto.post;

import com.pard.server.hw4.entity.Member;
import com.pard.server.hw4.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDetailResponse {
    private Long id;
    private Long memberId;
    private String authorName;
    private String title;
    private String content;
    private Long likes;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static PostDetailResponse fromEntity(Post post, Long likes, Member member){
        return PostDetailResponse.builder()
                .id(post.getId())
                .memberId(post.getMemberId())
                .authorName(member.getDisplayName())
                .title(post.getTitle())
                .content(post.getContent())
                .likes(likes)
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .build();
    }
}
