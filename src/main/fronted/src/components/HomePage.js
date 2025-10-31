// src/components/HomePage.js

import React, { useState, useEffect } from 'react';
import {
    PlusCircle, Heart, MessageSquare, User, LogOut,
    Edit2, Trash2, Clock, RefreshCw, ChevronDown, X
} from 'lucide-react';

const HomePage = ({ onLogout }) => {
    // 상태 관리
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '' }); // body → content
    const [editingPost, setEditingPost] = useState(null);
    const [error, setError] = useState('');
    const [lastCreatedAt, setLastCreatedAt] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // 컴포넌트 마운트시 실행
    useEffect(() => {
        // 로그인 사용자 정보 가져오기
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            // 로그인 안됨 - 로그인 페이지로
            if (onLogout) {
                onLogout();
            } else {
                window.location.href = '/login';
            }
            return;
        }
        setCurrentUser(JSON.parse(userStr));

        // 게시글 목록 가져오기 (첫 로드)
        fetchPosts(true);
    }, []);

    // 게시글 목록 조회 (스크롤 페이지네이션)
    const fetchPosts = async (isInitial = false) => {
        if (isInitial) {
            setIsLoading(true);
            setLastCreatedAt(null);
        } else {
            setIsLoadingMore(true);
        }
        setError('');

        try {
            // API URL 구성 - GET /api/posts
            let url = '/api/posts?size=10';
            if (!isInitial && lastCreatedAt) {
                url += `&lastCreatedAt=${encodeURIComponent(lastCreatedAt)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();

                // PostScrollResponse 구조에 맞게 처리
                if (data.posts && Array.isArray(data.posts)) {
                    // 게시글 데이터 처리 (body/content 필드 통일)
                    const processedPosts = data.posts.map(post => ({
                        ...post,
                        body: post.body || post.content, // content를 body로 매핑
                        content: post.content || post.body // body를 content로도 저장
                    }));
                    console.log("🔥 processedPosts[0].likes:", processedPosts[0]?.likes);


                    if (isInitial) {
                        setPosts(processedPosts);
                    } else {
                        setPosts(prev => [...prev, ...processedPosts]);
                    }

                    // 마지막 게시글의 createdAt 저장
                    if (processedPosts.length > 0) {
                        const lastPost = processedPosts[processedPosts.length - 1];
                        setLastCreatedAt(lastPost.createdAt);
                    }

                    // hasNext로 더 있는지 확인
                    setHasMore(data.hasNext === true);
                } else {
                    if (isInitial) {
                        setPosts([]);
                    }
                    setHasMore(false);
                }
            } else if (response.status === 401) {
                // 인증 실패
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                if (onLogout) {
                    onLogout();
                }
            } else {
                throw new Error('게시글을 불러올 수 없습니다');
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
            setError('게시글을 불러오는데 실패했습니다');

            // 개발 중 데모 데이터
            if (isInitial && posts.length === 0) {
                const demoData = {
                    posts: [
                        {
                            id: 1,
                            title: '첫 번째 게시글입니다',
                            body: '안녕하세요! 블로그에 오신 것을 환영합니다.',
                            content: '안녕하세요! 블로그에 오신 것을 환영합니다.',
                            memberId: 1,
                            memberDisplayName: 'test',
                            createdAt: '2024-10-31T10:00:00',
                            likeCount: 2,
                            likes: [
                                { id: 1, memberId: 2 },
                                { id: 2, memberId: 3 }
                            ],
                            commentCount: 3
                        },
                        {
                            id: 2,
                            title: 'Spring Boot와 React 연동',
                            body: 'Spring Boot 백엔드와 React 프론트엔드를 연동하는 방법을 소개합니다.',
                            content: 'Spring Boot 백엔드와 React 프론트엔드를 연동하는 방법을 소개합니다.',
                            memberId: 2,
                            memberDisplayName: 'user2',
                            createdAt: '2024-10-30T14:30:00',
                            likeCount: 1,
                            likes: [
                                { id: 3, memberId: 1 }
                            ],
                            commentCount: 1
                        }
                    ],
                    hasNext: false
                };
                setPosts(demoData.posts);
                setHasMore(demoData.hasNext);
                if (demoData.posts.length > 0) {
                    setLastCreatedAt(demoData.posts[demoData.posts.length - 1].createdAt);
                }
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // 새 게시글 작성 - POST /api/posts
    const handleCreatePost = async () => {
        if (!newPost.title.trim() || !newPost.content.trim()) {
            alert('제목과 내용을 모두 입력해주세요');
            return;
        }
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const memberId = user.id || user.memberId;

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    memberId: memberId,
                    title: newPost.title.trim(),
                    content: newPost.content.trim() // body → content
                })
            });

            if (response.ok) {
                // 게시글 목록 새로고침
                await fetchPosts(true);
                setShowNewPost(false);
                setNewPost({ title: '', content: '' });
                alert('게시글이 작성되었습니다!');
            } else if (response.status === 401) {
                alert('로그인이 필요합니다');
                if (onLogout) {
                    onLogout();
                }
            } else {
                const errorText = await response.text();
                console.error('Create post error:', errorText);
                throw new Error('게시글 작성 실패');
            }
        } catch (error) {
            console.error('Create post error:', error);
            alert('게시글 작성에 실패했습니다');
        }
    };

    // 게시글 수정 시작
    const handleEditStart = (post) => {
        setEditingPost({
            id: post.id,
            title: post.title,
            content: post.content || post.body // body나 content 둘 다 처리
        });
    };

    // 게시글 수정 완료 - POST /api/posts/{id}
    const handleUpdatePost = async () => {
        if (!editingPost.title.trim() || !editingPost.content.trim()) {
            alert('제목과 내용을 모두 입력해주세요');
            return;
        }

        try {
            const response = await fetch(`/api/posts/${editingPost.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    title: editingPost.title.trim(),
                    content: editingPost.content.trim() // body → content
                })
            });

            if (response.ok) {
                await fetchPosts(true);
                setEditingPost(null);
                alert('게시글이 수정되었습니다!');
            } else if (response.status === 401) {
                alert('로그인이 필요합니다');
                if (onLogout) {
                    onLogout();
                }
            } else if (response.status === 403) {
                alert('수정 권한이 없습니다');
            } else {
                throw new Error('게시글 수정 실패');
            }
        } catch (error) {
            console.error('Update post error:', error);
            alert('게시글 수정에 실패했습니다');
        }
    };

    // 게시글 삭제 - DELETE /api/posts/{id}
    const handleDelete = async (postId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (response.ok) {
                await fetchPosts(true);
                alert('게시글이 삭제되었습니다');
            } else if (response.status === 401) {
                alert('로그인이 필요합니다');
                if (onLogout) {
                    onLogout();
                }
            } else if (response.status === 403) {
                alert('삭제 권한이 없습니다');
            } else {
                throw new Error('게시글 삭제 실패');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('게시글 삭제에 실패했습니다');
        }
    };

    // 좋아요 토글
    const [likeLoading, setLikeLoading] = useState(false);

    const handleLike = async (post) => {
        if (likeLoading) return;
        setLikeLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const memberId = user.id || user.memberId;

            if (!memberId) {
                alert('로그인이 필요합니다');
                return;
            }

            // 이미 좋아요를 눌렀는지 확인
            const existingLike = post.likes?.find(like => like.memberId === memberId);

            if (existingLike) {
                // 좋아요 취소 - DELETE /api/posts/likes/{likeId}/delete
                const response = await fetch(`/api/posts/likes/${existingLike.id}/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    }
                });

                if (response.ok) {
                    // 로컬 상태 업데이트
                    const updated = await fetch(`/api/posts/${post.id}`);
                    const data = await updated.json();

                    setPosts(prev =>
                        prev.map(p => (p.id === post.id ? data : p))
                    );

                } else {
                    throw new Error('좋아요 취소 실패');
                }
            } else {
                // 좋아요 추가 - POST /api/posts/{postId}/likes
                const response = await fetch(`/api/posts/${post.id}/likes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    },
                    body: JSON.stringify({
                        memberId: memberId
                    })
                });

                if (response.ok) {
                    // 로컬 상태 업데이트 (임시 ID 부여)
                    setPosts(prevPosts =>
                        prevPosts.map(p =>
                            p.id === post.id
                                ? {
                                    ...p,
                                    likes: [...(p.likes || []), { id: Date.now(), memberId }],
                                    likeCount: (p.likeCount || 0) + 1
                                }
                                : p
                        )
                    );
                } else {
                    throw new Error('좋아요 실패');
                }
            }
        } catch (error) {
            console.error('Like error:', error);
            alert('좋아요 처리에 실패했습니다');
        } finally {
            setLikeLoading(false);
        }
    };

    // 날짜 포맷
    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;

            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return '방금 전';
            if (minutes < 60) return `${minutes}분 전`;
            if (hours < 24) return `${hours}시간 전`;
            if (days < 7) return `${days}일 전`;

            return date.toLocaleDateString('ko-KR');
        } catch (error) {
            return dateStr;
        }
    };

    // 더보기 버튼 클릭
    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            fetchPosts(false);
        }
    };

    // 현재 사용자가 좋아요 눌렀는지 확인
    const isLikedByCurrentUser = (post) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const memberId = user.id || user.memberId;
        return post.likes?.some(like => like.memberId === memberId) || false;
    };

    return (
        <div style={styles.container}>
            {/* 헤더 */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.logo}>My Blog</h1>
                    <div style={styles.headerRight}>
            <span style={styles.userName}>
              <User size={16} />
                {currentUser?.displayName || currentUser?.userName}
            </span>
                        <button
                            style={styles.logoutBtn}
                            onClick={onLogout}
                        >
                            <LogOut size={16} />
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div style={styles.main}>
                <div style={styles.content}>
                    {/* 새 게시글 버튼 */}
                    <button
                        style={styles.newPostBtn}
                        onClick={() => setShowNewPost(true)}
                    >
                        <PlusCircle size={20} />
                        새 게시글 작성
                    </button>

                    {/* 에러 메시지 */}
                    {error && (
                        <div style={styles.errorMessage}>
                            {error}
                            <button
                                style={styles.retryBtn}
                                onClick={() => fetchPosts(true)}
                            >
                                <RefreshCw size={14} />
                                다시 시도
                            </button>
                        </div>
                    )}

                    {/* 로딩 상태 */}
                    {isLoading ? (
                        <div style={styles.loading}>
                            <RefreshCw className="spin" size={24} />
                            <p>게시글을 불러오는 중...</p>
                        </div>
                    ) : (
                        <>
                            {/* 게시글 목록 */}
                            {posts.length > 0 ? (
                                <div style={styles.postList}>
                                    {posts.map(post => (
                                        <div key={post.id} style={styles.postCard}>
                                            <div style={styles.postHeader}>
                                                <div style={styles.postAuthor}>
                                                    <User size={16} />
                                                    <span>{post.memberDisplayName || '익명'}</span>
                                                    <span style={styles.postTime}>
                            <Clock size={12} />
                                                        {formatDate(post.createdAt)}
                          </span>
                                                </div>
                                                {/* 본인 게시글만 수정/삭제 가능 */}
                                                {(currentUser?.id === post.memberId ||
                                                    currentUser?.memberId === post.memberId ||
                                                    currentUser?.userName === post.memberDisplayName) && (
                                                    <div style={styles.postActions}>
                                                        <button
                                                            style={styles.actionBtn}
                                                            onClick={() => handleEditStart(post)}
                                                            title="수정"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            style={styles.actionBtn}
                                                            onClick={() => handleDelete(post.id)}
                                                            title="삭제"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <h2 style={styles.postTitle}>{post.title}</h2>
                                            <p style={styles.postBody}>{post.body || post.content}</p>
                                            <div style={styles.postFooter}>
                                                <button
                                                    style={{
                                                        ...styles.likeBtn,
                                                        ...(isLikedByCurrentUser(post) ? styles.liked : {})
                                                    }}
                                                    onClick={() => handleLike(post)}
                                                >
                                                    <Heart
                                                        size={16}
                                                        fill={isLikedByCurrentUser(post) ? '#ff4458' : 'none'}
                                                    />
                                                    {post.likeCount || 0}
                                                </button>
                                                <button style={styles.commentBtn}>
                                                    <MessageSquare size={16} />
                                                    {post.commentCount || 0}
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 더보기 버튼 */}
                                    {hasMore && (
                                        <button
                                            style={styles.loadMoreBtn}
                                            onClick={handleLoadMore}
                                            disabled={isLoadingMore}
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <RefreshCw className="spin" size={16} />
                                                    로딩 중...
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown size={16} />
                                                    더보기
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {!hasMore && posts.length > 0 && (
                                        <div style={styles.noMore}>
                                            모든 게시글을 불러왔습니다
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={styles.empty}>
                                    <MessageSquare size={48} />
                                    <p>아직 게시글이 없습니다</p>
                                    <p style={styles.emptySubtext}>첫 번째 게시글을 작성해보세요!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* 새 게시글 작성 모달 */}
            {showNewPost && (
                <>
                    <div
                        style={styles.modalOverlay}
                        onClick={() => setShowNewPost(false)}
                    />
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>새 게시글 작성</h2>
                            <button
                                style={styles.closeBtn}
                                onClick={() => setShowNewPost(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <input
                            style={styles.modalInput}
                            type="text"
                            placeholder="제목을 입력하세요"
                            value={newPost.title}
                            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                            autoFocus
                            maxLength={100}
                        />
                        <textarea
                            style={styles.modalTextarea}
                            placeholder="내용을 입력하세요"
                            rows={8}
                            value={newPost.content}
                            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                            maxLength={5000}
                        />
                        <div style={styles.characterCount}>
                            {newPost.content.length} / 5000
                        </div>
                        <div style={styles.modalButtons}>
                            <button
                                style={styles.cancelBtn}
                                onClick={() => setShowNewPost(false)}
                            >
                                취소
                            </button>
                            <button
                                style={styles.submitBtn}
                                onClick={handleCreatePost}
                                disabled={!newPost.title.trim() || !newPost.content.trim()}
                            >
                                작성하기
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* 게시글 수정 모달 */}
            {editingPost && (
                <>
                    <div
                        style={styles.modalOverlay}
                        onClick={() => setEditingPost(null)}
                    />
                    <div style={styles.modal}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>게시글 수정</h2>
                            <button
                                style={styles.closeBtn}
                                onClick={() => setEditingPost(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <input
                            style={styles.modalInput}
                            type="text"
                            placeholder="제목을 입력하세요"
                            value={editingPost.title}
                            onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                            autoFocus
                            maxLength={100}
                        />
                        <textarea
                            style={styles.modalTextarea}
                            placeholder="내용을 입력하세요"
                            rows={8}
                            value={editingPost.content}
                            onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                            maxLength={5000}
                        />
                        <div style={styles.characterCount}>
                            {editingPost.content.length} / 5000
                        </div>
                        <div style={styles.modalButtons}>
                            <button
                                style={styles.cancelBtn}
                                onClick={() => setEditingPost(null)}
                            >
                                취소
                            </button>
                            <button
                                style={styles.submitBtn}
                                onClick={handleUpdatePost}
                                disabled={!editingPost.title.trim() || !editingPost.content.trim()}
                            >
                                수정하기
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* 스타일 애니메이션 */}
            <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

// 스타일 정의
const styles = {
    container: {
        minHeight: '100vh',
        background: '#f8f9fa'
    },
    header: {
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    headerContent: {
        maxWidth: '680px',
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        color: '#666'
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '20px',
        fontSize: '14px',
        color: '#666',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    main: {
        maxWidth: '680px',
        margin: '0 auto',
        padding: '20px'
    },
    content: {
        width: '100%'
    },
    newPostBtn: {
        width: '100%',
        padding: '16px',
        background: 'white',
        border: '2px dashed #667eea',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '16px',
        color: '#667eea',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '20px'
    },
    errorMessage: {
        background: '#fee',
        color: '#c00',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px'
    },
    retryBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        background: 'white',
        border: '1px solid #c00',
        borderRadius: '4px',
        color: '#c00',
        fontSize: '12px',
        cursor: 'pointer'
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        color: '#999'
    },
    postList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    postCard: {
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    postHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    postAuthor: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#666'
    },
    postTime: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        color: '#999',
        marginLeft: '8px'
    },
    postActions: {
        display: 'flex',
        gap: '8px'
    },
    actionBtn: {
        padding: '6px',
        background: 'transparent',
        border: 'none',
        color: '#999',
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background 0.2s'
    },
    postTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333'
    },
    postBody: {
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#666',
        marginBottom: '16px',
        whiteSpace: 'pre-wrap'
    },
    postFooter: {
        display: 'flex',
        gap: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #f0f0f0'
    },
    likeBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: 'transparent',
        border: '1px solid #ddd',
        borderRadius: '20px',
        color: '#666',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    liked: {
        color: '#ff4458',
        borderColor: '#ff4458',
        background: '#fff5f5'
    },
    commentBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: 'transparent',
        border: '1px solid #ddd',
        borderRadius: '20px',
        color: '#666',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    empty: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#999'
    },
    emptySubtext: {
        fontSize: '14px',
        marginTop: '5px',
        color: '#bbb'
    },
    loadMoreBtn: {
        width: '100%',
        padding: '12px',
        marginTop: '20px',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        color: '#666',
        fontSize: '14px',
        transition: 'all 0.2s'
    },
    noMore: {
        textAlign: 'center',
        padding: '20px',
        color: '#999',
        fontSize: '14px'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000
    },
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        width: '90%',
        maxWidth: '500px',
        zIndex: 1001,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    modalTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333'
    },
    closeBtn: {
        padding: '4px',
        background: 'transparent',
        border: 'none',
        color: '#999',
        cursor: 'pointer',
        borderRadius: '4px'
    },
    modalInput: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        marginBottom: '15px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    modalTextarea: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        marginBottom: '10px',
        outline: 'none',
        resize: 'vertical',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        minHeight: '150px'
    },
    characterCount: {
        textAlign: 'right',
        fontSize: '12px',
        color: '#999',
        marginBottom: '15px'
    },
    modalButtons: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end'
    },
    cancelBtn: {
        padding: '10px 20px',
        background: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    submitBtn: {
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    }
};

export default HomePage;