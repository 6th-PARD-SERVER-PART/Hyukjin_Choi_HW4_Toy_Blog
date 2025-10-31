package com.pard.server.hw4.dto.post;

import com.pard.server.hw4.dto.like.LikeResponse;
import com.pard.server.hw4.entity.Member;
import com.pard.server.hw4.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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
    private Long likeCount;
    private List<LikeResponse> likes;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    public static PostDetailResponse fromEntity(Post post, List<LikeResponse> likes, Member member){
        return PostDetailResponse.builder()
                .id(post.getId())
                .memberId(post.getMemberId())
                .authorName(member.getDisplayName())
                .likeCount((long) likes.size())
                .title(post.getTitle())
                .content(post.getContent())
                .likes(likes)
                .createdAt(post.getCreatedAt())
                .modifiedAt(post.getModifiedAt())
                .build();
    }
}
