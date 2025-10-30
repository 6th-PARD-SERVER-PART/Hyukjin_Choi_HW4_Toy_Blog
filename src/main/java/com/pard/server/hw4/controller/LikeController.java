package com.pard.server.hw4.controller;

import com.pard.server.hw4.dto.like.LikeCreateRequest;
import com.pard.server.hw4.service.LikeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Like", description = "Like 관련 API")
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/{postId}/likes")
    public ResponseEntity<Void> likedPost(@RequestBody LikeCreateRequest request, @PathVariable Long postId){
        likeService.likePostWithMemberId(request.getMemberId(), postId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/likes/{likeId}/delete")
    public ResponseEntity<Void> UnLikedPost(@PathVariable Long likeId){
        likeService.unLikePostWithMemberId(likeId);
        return ResponseEntity.ok().build();
    }


}
