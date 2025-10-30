package com.pard.server.hw4.dto.post;

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
public class PostScrollResponse {
    private List<PostDetailResponse> posts;
    private LocalDateTime nextCursor;
    private boolean hasNext;

    public static PostScrollResponse of(List<PostDetailResponse> posts, boolean hasNext) {
        LocalDateTime nextCursor = null;

        if (!posts.isEmpty()) {
            nextCursor = posts.get(posts.size() - 1).getCreatedAt();
        }

        return PostScrollResponse.builder()
                .posts(posts)
                .nextCursor(nextCursor)
                .hasNext(hasNext)
                .build();
    }
}
