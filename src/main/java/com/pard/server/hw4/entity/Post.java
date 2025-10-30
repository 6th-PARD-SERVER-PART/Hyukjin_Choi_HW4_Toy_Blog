package com.pard.server.hw4.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "posts",
        indexes = {
            @Index(name = "idx_posts_created_at", columnList = "created_at DESC")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@SuperBuilder
public class Post extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    public static Post of(Long memberId, String title, String content) {
        return Post.builder()
                .memberId(memberId)
                .title(title)
                .content(content)
                .build();
    }

    public void updatePost(String title, String content){
        this.title = title;
        this.content = content;
    }
}
