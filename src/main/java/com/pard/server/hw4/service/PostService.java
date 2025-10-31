package com.pard.server.hw4.service;

import com.pard.server.hw4.dto.like.LikeResponse;
import com.pard.server.hw4.dto.post.PostCreateRequest;
import com.pard.server.hw4.dto.post.PostDetailResponse;
import com.pard.server.hw4.dto.post.PostScrollResponse;
import com.pard.server.hw4.dto.post.PostUpdateRequest;
import com.pard.server.hw4.entity.Member;
import com.pard.server.hw4.entity.Post;
import com.pard.server.hw4.repository.LikeRepository;
import com.pard.server.hw4.repository.MemberRepository;
import com.pard.server.hw4.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;

    public void createPost(PostCreateRequest request) {
        Post post = PostCreateRequest.toEntity(request);

        postRepository.save(post);
    }

    public void updatePost(Long id, PostUpdateRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post를 찾을 수 업습니다."));

        post.updatePost(request.getTitle(), request.getContent());
    }

    public void deletePost(Long id){
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post를 찾을 수 업습니다."));

        postRepository.deleteById(id);
    }

    public PostDetailResponse getPost(Long id){
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post를 찾을 수 업습니다."));

        Member member = memberRepository.findById(post.getMemberId())
                .orElseThrow(() -> new EntityNotFoundException("Member를 찾을 수 업습니다."));

        List<LikeResponse> likeResponses = likeRepository.findByPostId(post.getId())
                .stream()
                .map(LikeResponse::fromEntity)
                .toList();

        return PostDetailResponse.fromEntity(post, likeResponses, member);
    }

    public PostScrollResponse getPosts(String lastCreatedAt, int size){
        LocalDateTime cursor;
        if (lastCreatedAt == null){
            cursor = LocalDateTime.now();
        } else {
            cursor = LocalDateTime.parse(lastCreatedAt);
        }

        System.out.println("요청 lastCreatedAt = " + lastCreatedAt);
        System.out.println("커서 = " + cursor);


        List<Post> posts = postRepository.findByCreatedAtBeforeOrderByCreatedAtDesc(cursor, PageRequest.of(0,size + 1));

        boolean hasNext = posts.size() > size;

        List<PostDetailResponse> contents = posts.stream()
                .limit(size)
                .map(post -> {
                    Member member = memberRepository.findById(post.getMemberId())
                            .orElseThrow(() -> new EntityNotFoundException("Member를 찾을 수 업습니다."));

                    List<LikeResponse> likeResponses = likeRepository.findByPostId(post.getId())
                            .stream()
                            .map(LikeResponse::fromEntity)
                            .toList();

                    return PostDetailResponse.fromEntity(post, likeResponses, member);
                }).
                toList();

        System.out.println("조회 쿼리 결과 개수 = " + posts.size());
        System.out.println("내보낼 게시물 id");
        for (PostDetailResponse content : contents) {
            System.out.println(content.getId());
        }

        return PostScrollResponse.of(contents,hasNext);
    }
}
