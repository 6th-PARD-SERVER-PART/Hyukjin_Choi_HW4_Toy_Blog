package com.pard.server.hw4.service;

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

        Long likes = likeRepository.countByPostId(id);

        return PostDetailResponse.fromEntity(post, likes, member);
    }

    public PostScrollResponse getPosts(String lastCratedAt, int size){
        LocalDateTime cursor;
        if (lastCratedAt == null){
            cursor = LocalDateTime.now();
        } else {
            cursor = LocalDateTime.parse(lastCratedAt);
        }

        List<Post> posts = postRepository.findByCreatedAtBeforeOrderByCreatedAtDesc(cursor, PageRequest.of(0,size + 1));

        boolean hasNext = posts.size() > size;

        List<PostDetailResponse> content = posts.stream()
                .limit(size)
                .map(post -> PostDetailResponse.fromEntity(
                        post,
                        likeRepository.countByPostId(post.getId()),
                        memberRepository.findById(post.getMemberId())
                                .orElseThrow(() -> new EntityNotFoundException("Member를 찾을 수 없습니다."))
                )).
                toList();

        return PostScrollResponse.of(content,hasNext);
    }
}
