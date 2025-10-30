package com.pard.server.hw4.controller;

import com.pard.server.hw4.dto.post.PostCreateRequest;
import com.pard.server.hw4.dto.post.PostDetailResponse;
import com.pard.server.hw4.dto.post.PostScrollResponse;
import com.pard.server.hw4.dto.post.PostUpdateRequest;
import com.pard.server.hw4.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Post", description = "Post 관련 API")
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping("")
    public ResponseEntity<Void> createPost(@RequestBody PostCreateRequest request){
        postService.createPost(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody PostUpdateRequest request){
        postService.updatePost(id, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id){
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));

    }

    @GetMapping("")
    public ResponseEntity<PostScrollResponse> getPosts(
            @RequestParam(required = false) String lastCreatedAt,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(postService.getPosts(lastCreatedAt, size));
    }
}
