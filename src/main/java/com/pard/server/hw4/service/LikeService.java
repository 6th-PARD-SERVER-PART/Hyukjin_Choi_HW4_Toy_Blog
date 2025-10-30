package com.pard.server.hw4.service;

import com.pard.server.hw4.entity.Like;
import com.pard.server.hw4.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;

    public void likePostWithMemberId(Long memberId, Long postId){

        Like like = Like.of(memberId, postId);
        likeRepository.save(like);
    }

    public void unLikePostWithMemberId(Long likedId){
        likeRepository.deleteById(likedId);
    }
}
